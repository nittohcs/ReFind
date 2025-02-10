"use client";

import { FC, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useAuthState } from "@/hooks/auth";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { addUserToGroup, adminUpdateUserAttributes, removeUserFromGroup } from "@/services/AdminQueries";
import { queryKeys } from "@/services/queryKeys";
import { AdminQueriesUser, ReFindUser } from "@/types/user";

type FormValues = {
    id: string,
    name: string,
    email: string,
    isAdmin: boolean,
};

type EditUserFormProps = {
    id: string,
};

export const EditUserForm: FC<EditUserFormProps> = ({ id }) => {
    const tenantId = useTenantId();
    const authState = useAuthState();

    const query = useReFindUsers();
    const user = useMemo(() => (query.data ?? []).find(x => x.id === id), [query.data, id]);

    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required().default(""),
        name: yup.string().required().default(""),
        email: yup.string().required().email().default(""),
        isAdmin: yup.bool().required().default(false).test("isAdmin", "操作中のユーザーを管理者ではなくすることはできません", value => {
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
        isAdmin: user?.isAdmin,
    }), [validationSchema, user]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const updated = {
                ...values,
                tenantId: tenantId,
            };

            // cognitoユーザー編集
            await adminUpdateUserAttributes(updated);

            // cognitoのグループに追加
            if (updated.isAdmin !== initialValues.isAdmin) {
                await removeUserFromGroup(updated, initialValues.isAdmin ? "admins" : "users");
                await addUserToGroup(updated, updated.isAdmin ? "admins" : "users");
            }
        },
        onSuccess(_data, variables, _context) {
            enqueueSnackbar("保存しました。", { variant: "success" });

            // クエリのキャッシュを更新する
            const updated: ReFindUser = {
                ...user!,
                name: variables.name,
                email: variables.email,
                isAdmin: variables.isAdmin,
            };
            queryClient.setQueryData(queryKeys.listUsersByTenantId(tenantId), (items: AdminQueriesUser[] = []) => items.map(item => item.id === updated.id ? updated : item));
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
                        disabled={true}
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
                            保存
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default EditUserForm;
