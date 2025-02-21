"use client";

import { FC, RefObject, useCallback, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import { ImageUploadState, MiraCalImageUpload } from "@/components/MiraCalImageUpload";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { uploadFile } from "@/hooks/storage";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { isUsernameAvailable } from "@/services/AdminQueries";
import { useGetTenant } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { ReFindUser } from "@/types/user";
import { createReFindUser } from "../user";

type FormValues = {
    id: string,
    name: string,
    email: string,
    image: string,
    comment: string,
    isAdmin: boolean,
};

type RegisterUserFormProps = {
    update: () => void,
};

export const RegisterUserForm: FC<RegisterUserFormProps> = ({ update }) => {
    const tenantId = useTenantId();
    const qTenant = useGetTenant(tenantId);
    const qUsers = useReFindUsers();
    // ユーザーID存在チェック結果のキャッシュ用
    const cacheRef = useRef(new Map<string, boolean>());

    const imageFileRef = useRef<HTMLInputElement>(null);

    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required().default("").test("isAvailable", "このIDは既に使用されています。", async (value) => {
            if (!value) {
                return false;
            }

            if (cacheRef.current.has(value)) {
                return cacheRef.current.get(value)!;
            }
            const isAvailable = await isUsernameAvailable(value);
            cacheRef.current.set(value, isAvailable);
            return isAvailable;
        }),
        name: yup.string().required().default(""),
        email: yup.string().required().email().default(""),
        image: yup.string().required().default(ImageUploadState.Unchange),
        comment: yup.string().required().default(""),
        isAdmin: yup.bool().required().default(false),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            // 最大ユーザー数をチェック
            const maxUserCount = qTenant.data?.maxUserCount ?? 0;
            const currentUserCount = qUsers.data.length;
            if (currentUserCount >= maxUserCount) {
                throw new Error("ユーザーが最大数まで作成されています。");
            }

            const ret = await createReFindUser({
                ...values,
                tenantId: tenantId,
                seatId: "",
                seatName: "",
                floorId: "",
                floorName: "",
            });

            // 画像をアップロード
            function getFile(ref: RefObject<HTMLInputElement>) {
                return ref.current?.files && ref.current?.files.length > 0 ? ref.current.files[0] : undefined;
            }
            const file = getFile(imageFileRef);
            if (values.image === ImageUploadState.Upload && file) {
                const imagePath = `public/${tenantId}/users/${values.id}`;
                const _response = await uploadFile(imagePath, file);
                // if (!_response.ok) {
                //     throw new Error("登録に失敗しました。");
                // }
            }

            return ret;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("登録しました。", { variant: "success" });

            // クエリのキャッシュを更新する
            queryClient.setQueryData(queryKeys.graphqlUsersByTenantId(tenantId), (items: ReFindUser[] = []) => [...items, data]);

            // 入力欄を初期化するため、このコンポーネントを再表示する
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

    if (!qTenant.isFetched || !qUsers.isFetched) {
        return null;
    }

    return (
        <Box maxWidth="sm">
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="id"
                        label="ID"
                        type="text"
                        debounceTime={300}
                    />
                    <MiraCalTextField
                        name="email"
                        label="メールアドレス"
                        type="email"
                    />
                    <MiraCalTextField
                        name="name"
                        label="氏名"
                        type="text"
                    />
                    <MiraCalImageUpload
                        name="image"
                        label="画像"
                        currentFilePath={null}
                        accept="image/png, image/webp, image/jpeg"
                        fileRef={imageFileRef}
                        previewImageWidth={48}
                        previewImageHeight={48}
                    />
                    <MiraCalTextField
                        name="comment"
                        label="コメント"
                        type="text"
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
                        >
                            登録
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
}
export default RegisterUserForm;
