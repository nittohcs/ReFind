"use client";

import { FC, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { createReFindUser } from "../user";
import { queryKeys } from "@/services/queryKeys";
import { ReFindUser } from "@/types/user";

type FormValues = {
    id: string,
    name: string,
    email: string,
    isAdmin: boolean,
};

type RegisterUserFormProps = {
    update: () => void,
};

export const RegisterUserForm: FC<RegisterUserFormProps> = ({ update }) => {
    const tenantId = useTenantId();

    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required().default(""),
        name: yup.string().required().default(""),
        email: yup.string().required().email().default(""),
        isAdmin: yup.bool().required().default(false),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            return await createReFindUser({
                ...values,
                tenantId: tenantId,
                seatId: "",
                seatName: "",
                floorId: "",
                floorName: "",
            });
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
                            登録
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
}
export default RegisterUserForm;
