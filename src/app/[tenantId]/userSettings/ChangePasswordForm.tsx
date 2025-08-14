"use client";

import { FC, useCallback, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "aws-amplify/auth";
import { Formik } from "formik";
import * as yup from "yup";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalTextField from "@/components/MiraCalTextField";
import { useEnqueueSnackbar } from "@/hooks/ui";

type ChangePasswordFormValues = {
    oldPassword: string,
    newPassword: string,
    newPasswordRepeat: string,
};

type ChangePasswordFormProps = {
    update: () => void,
};

export const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ update }) => {
    const enqueueSnackbar = useEnqueueSnackbar();

    const validationSchema = useMemo(() => yup.object().shape({
        oldPassword: yup.string().required().min(8).default(""),
        newPassword: yup.string().required().min(8).default(""),
        newPasswordRepeat: yup.string().oneOf([yup.ref("newPassword")], "新しいパスワードと同じ値を入力してください").default(""),
    }), []);

    const initialValues: ChangePasswordFormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const mutation = useMutation(({
        async mutationFn({ oldPassword, newPassword}: ChangePasswordFormValues) {
            await updatePassword({ oldPassword, newPassword });
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("パスワードを変更しました。", { variant: "success" });
            update();
        },
        onError(error, _variables, _context) {
            console.log(error.message);
        },
    }));

    const onSubmit = useCallback((values: ChangePasswordFormValues) => mutation.mutate(values), [mutation]);

    return (
        <Box maxWidth="sm">
            <Typography variant="h6">パスワード</Typography>
            <Formik<ChangePasswordFormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="oldPassword"
                        label="パスワード"
                        type="password"
                    />
                    <MiraCalTextField
                        name="newPassword"
                        label="新しいパスワード"
                        type="password"
                    />
                    <MiraCalTextField
                        name="newPasswordRepeat"
                        label="新しいパスワード(確認用)"
                        type="password"
                    />
                    <MiraCalFormAction>
                        <Button variant="contained" type="submit" disabled={mutation.isPending}>パスワードを変更</Button>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default ChangePasswordForm;
