"use client";

import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import { useAuthState, useUpdateUserInfo } from "@/hooks/auth";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { ReFindUser } from "@/types/user";
import { useTenantId } from "../hook";
import { graphqlUpdateUserAttributes } from "./operation";

type EditUserSettingsFormValues = {
    username?: string,
    name?: string,
    email?: string,
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

    const validationSchema = useMemo(() => yup.object().shape({
        username: yup.string().default(""),
        name: yup.string().default("").required(),
        email: yup.string().default("").email().required(),
    }), []);

    const initialValues: EditUserSettingsFormValues = useMemo(() => validationSchema.cast({
        username: authState.username,
        name: authState.name,
        email: authState.email,
    }), [validationSchema, authState.username, authState.name, authState.email]);

    const mutation = useMutation(({
        async mutationFn(values: EditUserSettingsFormValues) {
            const input = {
                ...(values.email !== initialValues.email && { email: values.email }),
                ...(values.name !== initialValues.name && { name: values.name }),
            };
            const ret = await graphqlUpdateUserAttributes(input);
            return ret;
        },
        onSuccess(data, variables, _context) {
            let updated = false;
            let confirmRequired = false;

            if (data.isUpdatedName) {
                updateUserInfo({ name: variables.name });
                updated = true;
            }

            // メールアドレスは確認コードの入力が必要なので、これは実行されないはず
            if (data.isUpdatedEmail) {
                updateUserInfo({ email: variables.email });
                updated = true;
            }

            if (data.isRequiredVerification) {
                setConfirmingEmail(variables.email as string);
                confirmRequired = true;
            }

            if (updated) {
                enqueueSnackbar("変更を保存しました。", { variant: "success" });
                update();
            }
            if (confirmRequired) {
                enqueueSnackbar("メールアドレスを変更するには確認コードを入力してください。", { variant: "info" })
            }

            // クエリのキャッシュを更新
            queryClient.setQueryData(queryKeys.graphqlUsersByTenantId(tenantId), (items: ReFindUser[] = []) => items.map(user => user.id === variables.username ? {...user, ...(data.isUpdatedName && { name: variables.name }), ...(data.isUpdatedEmail && { email: variables.email })} : user));
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
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="username"
                        label="ユーザーID"
                        type="text"
                        disabled={true}
                    />
                    <MiraCalTextField
                        name="email"
                        label="メールアドレス"
                        type="email"
                        disabled={true}
                    />
                    <MiraCalTextField
                        name="name"
                        label="氏名"
                        type="text"
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
