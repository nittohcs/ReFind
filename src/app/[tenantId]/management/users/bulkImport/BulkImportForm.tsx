"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { Alert, Stack } from "@mui/material";
import { Formik } from "formik";
import * as yup from 'yup'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalCsvField from "@/components/MiraCalCsvField";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { AdminQueriesUser, ReFindUser } from "@/types/user";
import { createReFindUser } from "../user";
import PreviewTable from "./PreviewTable";
import { getReFindUsersFromCsv, isValidEmail } from "./util";

type FormValues = {
    csv: string,
};

type BulkImportFormProps = {
    update: () => void,
};

export const BulkImportForm: FC<BulkImportFormProps> = ({ update }) => {
    const tenantId = useTenantId();
    const [inputErrors, setInputErrors] = useState<string[]>([]);

    const query = useReFindUsers();
    const currentUserIds = useMemo(() => new Set((query.data ?? []).map(x => x.id)), [query.data]);

    const validationSchema = useMemo(() => yup.object().shape({
        csv: yup.string().required().default(""),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const users = getReFindUsersFromCsv(values.csv, tenantId);

            // 入力チェック
            const errors: string[] = [];
            if (users.length === 0) {
                errors.push("有効なデータが入力されていません。");
            }
            users.forEach((user, i) => {
                const index = i + 1;
                // idチェック
                if (!user.id) {
                    errors.push(`${index}件目: IDが入力されていません。`);
                }
                if (currentUserIds.has(user.id.toLowerCase())) {
                    errors.push(`${index}件目: 入力されたIDは既に使用されています。`);
                } else if (users.findIndex(x => x.id === user.id) !== i) {
                    errors.push(`${index}件目: 入力されたIDは既に使用されています。`);
                }

                // 氏名チェック
                if (!user.name) {
                    errors.push(`${index}件目: 氏名が入力されていません。`);
                }

                // メールアドレスチェック
                if (!user.email) {
                    errors.push(`${index}件目: メールアドレスが入力されていません。`);
                } else {
                    if (!isValidEmail(user.email)) {
                        errors.push(`${index}件目: メールアドレスが正しくありません。`);
                    }
                }
            });
            setInputErrors(errors);
            if (errors.length > 0) {
                throw new Error("入力データにエラーがあります。");
            }

            // ユーザー作成
            // Promise.allで並列処理すると大量データの場合にネットワークエラーが発生するので、1件ずつ処理する
            //const createdUsers = await Promise.all(users.map(user => createMiraCalUser(user)));
            setTotalCount(users.length);
            setCurrentCount(0);
            const createdUsers: ReFindUser[] = [];
            for(const user of users) {
                createdUsers.push(await createReFindUser(user));
                setCurrentCount(x => x + 1);
            }
            return createdUsers;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("取り込みました。", { variant: "success" });

            // クエリのキャッシュを更新する
            queryClient.setQueryData(queryKeys.listUsersByTenantId(tenantId), (items: AdminQueriesUser[] = []) => [...items, ...data]);

            // 入力欄を初期化するため、このコンポーネントを再表示する
            update();
        },
        onError(error, _variables, _context) {
            // クエリを再読み込みする
            queryClient.invalidateQueries({ queryKey: queryKeys.listUsersByTenantId(tenantId) });

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
        <Formik<FormValues>
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            <MiraCalForm>
                <MiraCalCsvField
                    name="csv"
                    label="CSV"
                    sampleUrl="/csv/createUsers.csv"
                />
                {inputErrors.length > 0 && (
                    <Stack direction="column" gap={1}>
                        {inputErrors.map(error => (
                            <Alert key={error} severity="error">{error}</Alert>
                        ))}
                    </Stack>
                )}
                <PreviewTable
                    name="csv"
                />
                {mutation.isPending && (
                    <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                )}
                <MiraCalFormAction>
                    <MiraCalButton
                        variant="contained"
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        取込
                    </MiraCalButton>
                </MiraCalFormAction>
            </MiraCalForm>
        </Formik>
    );
};
export default BulkImportForm;
