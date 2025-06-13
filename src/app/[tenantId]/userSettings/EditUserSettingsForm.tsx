"use client";

import { Dispatch, FC, RefObject, SetStateAction, useCallback, useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";
import { User } from "@/API";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import { ImageUploadState, MiraCalImageUpload } from "@/components/MiraCalImageUpload";
import MiraCalColorPicker from "@/components/MiraCalColorPicker";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import { useAuthState, useUpdateUserInfo } from "@/hooks/auth";
import { deleteFile, uploadFile } from "@/hooks/storage";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useGetUser } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { convertBMPtoPNG } from "@/services/util";
import { useTenantId } from "../hook";
import { graphqlUpdateUserAttributes } from "./operation";

type EditUserSettingsFormValues = {
    username: string,
    name: string,
    email: string,
    image: string,
    comment: string,
    commentForegroundColor: string,
    commentBackgroundColor: string,
};

type EditUserSettingsFormProps = {
    //confirmingEmail: string,
    setConfirmingEmail: Dispatch<SetStateAction<string>>,
    update: () => void,
};

export const EditUserSettingsForm: FC<EditUserSettingsFormProps> = ({ /*confirmingEmail,*/ setConfirmingEmail, update }) => {
    const tenantId = useTenantId();
    const authState = useAuthState();
    const updateUserInfo = useUpdateUserInfo();
    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const qUser = useGetUser(authState.username ?? "");
    const imageFileRef = useRef<HTMLInputElement>(null);
    const imagePath = `public/${tenantId}/users/${authState.username}`;

    const validationSchema = useMemo(() => yup.object().shape({
        username: yup.string().default(""),
        name: yup.string().default("").required(),
        email: yup.string().default("").email().required(),
        image: yup.string().required(),
        comment: yup.string().default(""),
        commentForegroundColor: yup.string().default(""),
        commentBackgroundColor: yup.string().default(""),
    }), []);

    const initialValues: EditUserSettingsFormValues = useMemo(() => validationSchema.cast({
        username: authState.username,
        name: authState.name,
        email: authState.email,
        image: ImageUploadState.Unchange,
        comment: qUser.data?.comment,
        commentForegroundColor: qUser.data?.commentForegroundColor ?? "#000000ff",
        commentBackgroundColor: qUser.data?.commentBackgroundColor ?? "#ffffffff",
    }), [validationSchema, authState.username, authState.name, authState.email, qUser.data]);

    const mutation = useMutation(({
        async mutationFn(values: EditUserSettingsFormValues) {
            const input = {
                ...(values.email !== initialValues.email && { email: values.email }),
                ...(values.name !== initialValues.name && { name: values.name }),
                ...(values.comment !== initialValues.comment && { comment: values.comment }),
                ...(values.commentForegroundColor !== initialValues.commentForegroundColor && { commentForegroundColor: values.commentForegroundColor }),
                ...(values.commentBackgroundColor !== initialValues.commentBackgroundColor && { commentBackgroundColor: values.commentBackgroundColor }),
            };
            const ret = await graphqlUpdateUserAttributes(input);

            let imageChanged = false;
            if (values.image === ImageUploadState.Upload) {
                // 画像をアップロード
                function getFile(ref: RefObject<HTMLInputElement>) {
                    return ref.current?.files && ref.current?.files.length > 0 ? ref.current.files[0] : undefined;
                }
                let file = getFile(imageFileRef);

                // ファイル容量チェック                
                const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
                if (file && file?.size > MAX_FILE_SIZE) {                    
                    throw new Error("1MB以下のファイルを選択してください。");
                }    

                const allowedImageTypes = ["image/png", "image/webp", "image/jpeg", "image/bmp", "image/gif"];

                if (file) {                    
                    // 拡張子チェック
                    const fileType = await fileTypeFromBlob(file);                
                    if (fileType?.mime && !allowedImageTypes.includes(fileType.mime)) {                    
                        throw new Error("画像ファイルを選択してください。");
                    }

                    // BMPの場合、PNGに変換
                    if (fileType?.mime === "image/bmp") {
                        const blob = await convertBMPtoPNG(file);
                        file = new File([blob], `${file.name}.png`, { type: "image/png" });
                    }

                    const _response = await uploadFile(imagePath, file);
                    // if (!_response.ok) {
                    //     throw new Error("登録に失敗しました。");
                    // }
                    imageChanged = true;
                }
            } else if (values.image === ImageUploadState.Delete) {
                await deleteFile(imagePath);
                imageChanged = true;
            }

            return { ...ret, imageChanged };
        },
        onSuccess(data, variables, _context) {
            let confirmRequired = false;

            if (data.isUpdatedName) {
                updateUserInfo({ name: variables.name });
            }

            // メールアドレスは確認コードの入力が必要なので、これは実行されないはず
            if (data.isUpdatedEmail) {
                updateUserInfo({ email: variables.email });
            }

            if (data.isRequiredVerification) {
                setConfirmingEmail(variables.email as string);
                confirmRequired = true;
            }

            if (data.updatedUser || data.imageChanged) {
                enqueueSnackbar("変更を保存しました。", { variant: "success" });
                // ここで更新日時を更新している？
                update();
            }
            if (confirmRequired) {
                enqueueSnackbar("メールアドレスを変更するには確認コードを入力してください。", { variant: "info" })
            }

            // クエリのキャッシュを更新
            if (data.updatedUser) {
                queryClient.setQueryData<User[]>(queryKeys.graphqlUsersByTenantId(tenantId), items => {
                    if (!items) {
                        return items;
                    }
                    return items.map(user => user.id === variables.username ? data.updatedUser! : user);
                });
                queryClient.setQueryData<User>(queryKeys.graphqlGetUser(variables.username), _user => data.updatedUser!);
            }
            if (data.imageChanged) {
                queryClient.invalidateQueries({ queryKey: queryKeys.storage(imagePath) });
            }
        },
        onError(error, _variables, _context) {
            if (!!error.message) {
                enqueueSnackbar(error.message, { variant: "error" });
                return;
            }

            // Error型以外でエラーが飛んでくる場合に対応
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tmp = error as any;
            for(const e of tmp.errors) {
                enqueueSnackbar(e.message, { variant: "error" });
            }
        },
    }));

    const onSubmit = useCallback((values: EditUserSettingsFormValues) => mutation.mutate(values), [mutation]);

    return (
        <Box maxWidth="sm">
            <Typography variant="h6">ユーザー情報</Typography>
            <Formik<EditUserSettingsFormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="username"
                        label="ユーザーID"
                        type="text"
                        disabled={true}
                        inputProps={{ maxLength: 100 }}
                    />
                    {/* <MiraCalTextField
                        name="email"
                        label="メールアドレス"
                        type="email"
                        disabled={true}                        
                    /> */}
                    <MiraCalTextField
                        name="name"
                        label="氏名"
                        type="text"
                        disabled={true}  
                        inputProps={{ maxLength: 100 }}
                    />
                    <MiraCalImageUpload
                        name="image"
                        label="画像"
                        currentFilePath={imagePath}
                        // 拡張子の制限
                        accept="image/png, image/webp, image/jpeg, image/bmp, image/gif"
                        fileRef={imageFileRef}
                        canDelete={true}
                        previewImageWidth={48}
                        previewImageHeight={48}
                    />
                    <MiraCalTextField
                        name="comment"
                        label="コメント"
                        type="text"
                        inputProps={{ maxLength: 100 }}
                    />
                    <MiraCalColorPicker
                        name="commentForegroundColor"
                        label="コメント文字色"
                    />
                    <MiraCalColorPicker
                        name="commentBackgroundColor"
                        label="コメント背景色"
                    />
                    <MiraCalFormAction>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending || !qUser.isFetched}
                            disabledWhenNotDirty={true}
                        >
                            保存
                        </MiraCalButton>
                        <MiraCalButton
                            variant="contained"
                            type="reset"
                            disabled={mutation.isPending}
                            disabledWhenNotDirty={true}
                        >
                            リセット
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default EditUserSettingsForm;
