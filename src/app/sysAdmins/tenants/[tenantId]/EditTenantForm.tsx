"use client";

import { FC, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useListAllTenants } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { graphqlUpdateTenant } from "../operation";

type FormValues = {
    id: string,
    name: string,
    isSuspended: boolean,
};

type EditTenantFormProps = {
    tenantId: string,
    update: () => void,
};

export const EditTenantForm: FC<EditTenantFormProps> = ({
    tenantId,
    update,
}) => {
    const query = useListAllTenants();
    const tenant = useMemo(() => (query.data ?? []).find(x => x.id === tenantId) ?? null, [query.data, tenantId]);

    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
        isSuspended: yup.bool().required(),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        id: tenant?.id ?? "",
        name: tenant?.name ?? "",
        isSuspended: tenant?.isSuspended ?? false,
    }), [validationSchema, tenant]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            // テーブル更新
            return await graphqlUpdateTenant({
                id: values.id,
                name: values.name,
                isSuspended: values.isSuspended,
            });
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("テナントを更新しました。", { variant: "success" });

            // クエリを無効化して再取得されるようにする
            queryClient.invalidateQueries({ queryKey: queryKeys.listAllTenants });

            // コンポーネントを再生成
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
                            保存
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default EditTenantForm;
