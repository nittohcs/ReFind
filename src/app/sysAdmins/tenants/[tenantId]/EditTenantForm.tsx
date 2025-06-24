"use client";

import { FC, useCallback, useMemo } from "react";
import Link from "next/link";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tenant } from "@/API";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useDialogStateWithData, useEnqueueSnackbar } from "@/hooks/ui";
import { useListAllTenants } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { graphqlUpdateTenant } from "../operation";
import DeleteTenantDialog from "./DeleteTenantDialog";

type FormValues = {
    id: string,
    name: string,
    maxUserCount: number,
    initialPassword: string,
    email: string,
    prefix: string,
    retentionPeriodDays: number,
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
        maxUserCount: yup.number().required().min(1),
        initialPassword: yup.string().required().default("").min(8),
        email: yup.string().required().default("").max(100),
        prefix: yup.string().required().default("").max(10),
        retentionPeriodDays: yup.number().required().default(0).min(1),
        isSuspended: yup.bool().required(),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        id: tenant?.id ?? "",
        name: tenant?.name ?? "",
        maxUserCount: tenant?.maxUserCount ?? 0,
        initialPassword: tenant?.initialPassword ?? "",
        email: tenant?.email ?? "",
        prefix: tenant?.prefix ?? "",
        retentionPeriodDays: tenant?.retentionPeriodDays ?? 0,
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
                maxUserCount: values.maxUserCount,
                initialPassword: values.initialPassword,
                email: values.email,
                prefix: values.prefix.toLocaleLowerCase(),
                retentionPeriodDays: values.retentionPeriodDays,
                isSuspended: values.isSuspended,
            });
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("テナントを更新しました。", { variant: "success" });

            // 更新したテナントだけキャッシュを更新
            queryClient.setQueryData<Tenant[]>(queryKeys.graphqlListAllTenants, items => {
                if (!items) {
                    return items;
                }
                return items.map(item => item.id === data.id ? data : item);
            });

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

    const deleteTenantDialogState = useDialogStateWithData<Tenant>();

    if (!tenant) {
        if (query.isFetched) {
            return (
                <Typography pt={2}>テナントが存在しません。</Typography>
            );
        } else {
            return null;
        }
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
                        name="name"
                        label="名前"
                        type="text"
                    />
                    <MiraCalTextField
                        name="maxUserCount"
                        label="最大ユーザー数"
                        type="number"
                    />
                    <MiraCalTextField
                        name="initialPassword"
                        label="初期パスワード"
                        type="text"
                    />
                    <MiraCalTextField
                        name="email"
                        label="メールアドレス"
                        type="text"
                    />
                    <MiraCalTextField
                        name="prefix"
                        label="テナント識別子"
                        type="text"
                    />
                    <MiraCalTextField
                        name="retentionPeriodDays"
                        label="座席確保履歴保管日数"
                        type="number"
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
                            disabledWhenNotDirty={true}
                        >
                            保存
                        </MiraCalButton>
                        <Tooltip title={!initialValues.isSuspended ? "削除を行うには利用停止中である必要があります。" : ""}>
                            <span>
                                <Button
                                    variant="contained"
                                    disabled={!initialValues.isSuspended || mutation.isPending}
                                    onClick={() => deleteTenantDialogState.open(tenant)}
                                >
                                    削除
                                </Button>
                            </span>
                        </Tooltip>
                        <Link href={`/${tenantId}`} target="_blank" rel="noopener noreferrer">
                            <Button
                                variant="contained"
                            >
                                テナントのページを表示
                            </Button>
                        </Link>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
            <DeleteTenantDialog {...deleteTenantDialogState} />
        </Box>
    );
};
export default EditTenantForm;
