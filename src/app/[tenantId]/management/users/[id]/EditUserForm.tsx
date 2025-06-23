"use client";

import { FC, RefObject, useCallback, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";
import { User } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import { ImageUploadState, MiraCalImageUpload } from "@/components/MiraCalImageUpload";
import MiraCalColorPicker from "@/components/MiraCalColorPicker";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useAuthState } from "@/hooks/auth";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { deleteFile, uploadFile } from "@/hooks/storage";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { addUserToGroup, adminUpdateUserAttributes, removeUserFromGroup } from "@/services/AdminQueries";
import { queryKeys } from "@/services/queryKeys";
import { convertBMPtoPNG } from "@/services/util";

type FormValues = {
    id: string,
    name: string,
    email: string,
    image: string,
    comment: string,
    commentForegroundColor: string,
    commentBackgroundColor: string,
    isAdmin: boolean,
};

type EditUserFormProps = {
    id: string,
    update: () => void,
};

export const EditUserForm: FC<EditUserFormProps> = ({ id, update }) => {
    const tenantId = useTenantId();
    const authState = useAuthState();

    const query = useReFindUsers();
    const user = useMemo(() => (query.data ?? []).find(x => x.id === id), [query.data, id]);

    const imageFileRef = useRef<HTMLInputElement>(null);
    const imagePath = `public/${tenantId}/users/${id}`;

    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required().default(""),
        name: yup.string().required().default(""),
        email: yup.string().required().email().default(""),
        image: yup.string().required(), // 容量制限
        comment: yup.string().default(""),
        commentForegroundColor: yup.string().default(""),
        commentBackgroundColor: yup.string().default(""),
        isAdmin: yup.bool().required().default(false).test("isAdmin", "操作中のユーザーを管理者をから外すことはできません。", value => {
            if (authState.username === user?.id && user?.isAdmin && !value) {
                return false;
            }
            return true;
        }),
    }), [authState.username, user]);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        image: ImageUploadState.Unchange,
        comment: user?.comment,
        commentForegroundColor: user?.commentForegroundColor ?? "#000000ff",
        commentBackgroundColor: user?.commentBackgroundColor ?? "#ffffffff",
        isAdmin: user?.isAdmin,
    }), [validationSchema, user]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const input = {
                ...values,
                tenantId: tenantId,
            };

            // cognitoユーザー編集
            let ret = await adminUpdateUserAttributes(input);

            // cognitoのグループに追加
            if (input.isAdmin !== initialValues.isAdmin) {
                const a = await removeUserFromGroup(input.id, initialValues.isAdmin ? "admins" : "users");
                if (a.updateUser) {
                    ret = a.updateUser;
                }
                const b = await addUserToGroup(input.id, input.isAdmin ? "admins" : "users");
                if (b.updateUser) {
                    ret = b.updateUser;
                }
            }

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
                }
            } else if (values.image === ImageUploadState.Delete) {
                // ファイルを削除
                await deleteFile(imagePath);
            }

            return ret;
        },
        onSuccess(data, variables, _context) {
            enqueueSnackbar("保存しました。", { variant: "success" });

            // クエリのキャッシュを更新する
            queryClient.setQueryData<User[]>(queryKeys.graphqlUsersByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.map(item => item.id === data.id ? data : item);
            });

            // 画像URLのクエリを無効化して再取得されるようにする
            if (variables.image !== ImageUploadState.Unchange) {
                queryClient.invalidateQueries({ queryKey: queryKeys.storage(imagePath) });
            }

            // コンポーネントを再生成
            // 更新日時を更新している？
            update();
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
    });

    const onSubmit = useCallback((values: FormValues) => mutation.mutate(values), [mutation]);

    if (query.data.length === 0) {
        return null;
    }
    if (!user) {
        // TODO ここもっと良い感じにする？ 404でいい？
        return "user not found";
    }

    return (
        <Box maxWidth="sm">
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="id"
                        label="ID"
                        type="text"
                        disabled={true} // 非活性
                        inputProps={{ maxLength: 100 }}  
                    />
                    {/* メールアドレスは未使用のため非表示 */}
                    {/* <MiraCalTextField
                        name="email"
                        label="メールアドレス"
                        type="email"
                    /> */}
                    <MiraCalTextField
                        name="name"
                        label="氏名"
                        type="text"
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
                    <MiraCalCheckbox
                        name="isAdmin"
                        label="管理者"
                    />
                    <MiraCalFormAction>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending}
                            disabledWhenNotDirty={true}
                        >
                            保存
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default EditUserForm;
