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
import { queryKeys } from "@/services/queryKeys";
import { graphqlCreateTenant } from "../operation";

type FormValues = {
    id: string,
    name: string,
    isSuspended: boolean,
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

            // テナントID
            const tenantId = tenant.id;

            // TODO テナントの管理者ユーザーを追加

            return {
                tenant,
            };
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("登録しました。", { variant: "success" });

            // フロア一覧取得クエリを無効化して再取得されるようにする
            queryClient.invalidateQueries({ queryKey: queryKeys.listAllTenants });

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
