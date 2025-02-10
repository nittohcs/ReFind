"use client";

import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { updateUserAttributes } from "aws-amplify/auth";
import { useMutation } from "@tanstack/react-query";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalErrorAlert from "@/components/MiraCalErrorAlert";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import { useAuthState, useUpdateUserInfo } from "@/hooks/auth";
import { useEnqueueSnackbar } from "@/hooks/ui";

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
    const authState = useAuthState();
    const updateUserInfo = useUpdateUserInfo();
    const enqueueSnackbar = useEnqueueSnackbar();

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
        async mutationFn({ name, email }: EditUserSettingsFormValues) {
            const attributes: EditUserSettingsFormValues = {};
            if (name !== initialValues.name) {
                attributes.name = name;
            }
            if (email !== initialValues.email) {
                attributes.email = email;
            }
            const output = await updateUserAttributes({
                userAttributes: attributes,
            });
            return output;
        },
        onSuccess(data, variables, _context) {
            let updated = false;
            let confirmRequired = false;

            if (data.name?.isUpdated) {
                updateUserInfo({ name: variables.name });
                updated = true;
            }

            // メールアドレスは確認コードの入力が必要なので、これは実行されないはず
            if (data.email?.isUpdated) {
                updateUserInfo({ email: variables.email });
                updated = true;
            }

            if (data.email?.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE") {
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
        },
        onError(error, _variables, _context) {
            console.log(error.message);
        },
    }));

    const onSubmit = useCallback((values: EditUserSettingsFormValues) => mutation.mutate(values), [mutation]);

    return (
        <Box>
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
                    />
                    <MiraCalTextField
                        name="name"
                        label="氏名"
                        type="text"
                    />
                    <MiraCalErrorAlert error={mutation.error} />
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
