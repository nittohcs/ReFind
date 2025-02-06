"use client";

import { FC, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { addUserToGroup, createUser, deleteUser } from "@/services/AdminQueries";
import { queryKeys } from "@/services/queryKeys";
import { AdminQueriesUser } from "@/types/user";
import { graphqlCreateTenant, graphqlDeleteTenant } from "../operation";
import { Tenant } from "@/API";

type FormValues = {
    id: string,
    name: string,
    isSuspended: boolean,
    adminUserId: string,
    adminEmail: string,
    adminName: string,
};

type CreateTenantFormProps = {
    update: () => void,
};

export const CreateTenantForm: FC<CreateTenantFormProps> = ({
    update,
}) => {
    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().default(""),
        name: yup.string().required().default(""),
        isSuspended: yup.bool().required().default(false),
        adminUserId: yup.string().required().default(""),
        adminEmail: yup.string().required().default("").email(),
        adminName: yup.string().required().default(""),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({

    }), [validationSchema]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            // テーブルに登録
            const tenant = await graphqlCreateTenant({
                ...(values.id && { id: values.id }),
                name: values.name,
                isSuspended: values.isSuspended,
            });

            try {
                const adminUser: AdminQueriesUser = {
                    id: values.adminUserId,
                    email: values.adminEmail,
                    name: values.adminName,
                    tenantId: tenant.id,
                };

                // テナントの管理者ユーザーを追加
                await createUser(adminUser);

                // テナントの管理者ユーザーを管理者にする
                try {
                    await addUserToGroup(adminUser, "admins");
                } catch (error) {
                    await deleteUser(adminUser);

                    throw error;
                }
            } catch(error) {
                await graphqlDeleteTenant({
                    id: tenant.id,
                });

                throw error;
            }

            return tenant;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("登録しました。", { variant: "success" });

            // フロア一覧取得クエリを無効化して再取得されるようにする
            //queryClient.invalidateQueries({ queryKey: queryKeys.listAllTenants });

            // 登録したテナントをキャッシュに追加
            queryClient.setQueryData(queryKeys.listAllTenants, (items: Tenant[] = []) => [...items, data]);

            // このコンポーネントを再表示させる
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
                    />
                    <MiraCalTextField
                        name="name"
                        label="名前"
                        type="text"
                    />
                    <MiraCalCheckbox
                        name="isSuspended"
                        label="利用停止中"
                    />
                    <MiraCalTextField
                        name="adminUserId"
                        label="管理者ID"
                        type="text"
                    />
                    <MiraCalTextField
                        name="adminEmail"
                        label="管理者メールアドレス"
                        type="email"
                    />
                    <MiraCalTextField
                        name="adminName"
                        label="管理者名"
                        type="text"
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
};
export default CreateTenantForm;
