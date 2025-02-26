"use client";

import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/API";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalTextField from "@/components/MiraCalTextField";
import { useAuthState, useUpdateUserInfo } from "@/hooks/auth";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "../hook";
import { graphqlVerifyUserAttribute } from "./operation";

type ConfirmUserSettingsFormValues = {
    confirmationCode: string,
};

type ConfirmUserSettingsFormProps = {
    confirmingEmail: string,
    setConfirmingEmail: Dispatch<SetStateAction<string>>,
    update: () => void,
};

export const ConfirmUserSettingsForm: FC<ConfirmUserSettingsFormProps> = ({ confirmingEmail, setConfirmingEmail, update }) => {
    const tenantId = useTenantId();
    const authState = useAuthState();
    const updateUserInfo = useUpdateUserInfo();
    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();

    const validationSchema = useMemo(() => yup.object().shape({
        confirmationCode: yup.string().required().default(""),
    }), []);

    const initialValues: ConfirmUserSettingsFormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const mutation = useMutation(({
        async mutationFn({ confirmationCode }: ConfirmUserSettingsFormValues) {
            return await graphqlVerifyUserAttribute("email", confirmationCode);
        },
        onSuccess(_data, _variables, _context) {
            // クエリのキャッシュを更新
            queryClient.setQueryData<User[]>(queryKeys.graphqlUsersByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.map(user => user.id === authState.username ? {...user, email: confirmingEmail, confirmingEmail: null } : user);
            });
            queryClient.setQueryData<User>(queryKeys.graphqlGetUser(authState.username!), item => {
                if (!item) {
                    return item;
                }
                return { ...item, email: confirmingEmail, confirmingEmail: null };
            });

            updateUserInfo({
                email: confirmingEmail,
            });
            setConfirmingEmail("");
            enqueueSnackbar("メールアドレスを変更しました。", { variant: "success" })
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
    }));

    const onSubmit = useCallback((values: ConfirmUserSettingsFormValues) => mutation.mutate(values), [mutation]);
    const cancel = useCallback(() => setConfirmingEmail(""), [setConfirmingEmail]);

    return (
        <Box maxWidth="sm">
            <Typography variant="h6">確認コード入力</Typography>
            <Typography variant="body1">{`${confirmingEmail}に確認コードが送信されました。確認コードを入力することでメールアドレスが変更されます。`}</Typography>
            <Formik<ConfirmUserSettingsFormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="confirmationCode"
                        label="確認コード"
                        type="text"
                    />
                    <MiraCalFormAction>
                        <Button variant="contained" type="submit" disabled={mutation.isPending}>入力</Button>
                        <Button variant="contained" onClick={cancel}>キャンセル</Button>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default ConfirmUserSettingsForm;
