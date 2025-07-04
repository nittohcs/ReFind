"use client";

import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Alert, Stack } from "@mui/material";
import { Formik } from "formik";
import * as yup from 'yup'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalCsvField from "@/components/MiraCalCsvField";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { isUsernameAvailable } from "@/services/AdminQueries";
import { useGetTenant } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { createReFindUser } from "../user";
import PreviewTable from "./PreviewTable";
import { getCreateUserInputsFromCsv, isValidEmail } from "./util";

type FormValues = {
    csv: string,
};

type BulkImportFormProps = {
    update: () => void,
};

export const BulkImportForm: FC<BulkImportFormProps> = ({ update }) => {
    const tenantId = useTenantId();
    const [inputErrors, setInputErrors] = useState<string[]>([]);
    const qTenant = useGetTenant(tenantId);
    const qUsers = useReFindUsers();
    const currentUserIds = useMemo(() => new Set((qUsers.data ?? []).map(x => x.id.toLowerCase())), [qUsers.data]);
    // ユーザーID存在チェック結果のキャッシュ用
    const cacheRef = useRef(new Map<string, boolean>());

    // useMemoでメモ化(キャッシュ)
    // useMemo(() => (処理内容), [依存する値]);
    // 重い処理の結果をキャッシュで保持する。
    // 依存する値が変更するたびに中の処理が実行されて、キャッシュを更新する。
    // 依存する値が変わらない限り、キャッシュの値を返し続ける。
    const validationSchema = useMemo(() => yup.object().shape({
        csv: yup.string().required().default(""),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const [totalCount, setTotalCount] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const users = getCreateUserInputsFromCsv(values.csv, tenantId);

            // 最大ユーザー数をチェック
            const maxUserCount = qTenant.data?.maxUserCount ?? 0;
            const currentUserCount = qUsers.data.length;
            const creatableUserCount = maxUserCount - currentUserCount;
            if (users.length > creatableUserCount) {
                throw new Error(`あと${creatableUserCount}ユーザーまで作成可能です。`);
            }

            // 入力チェック
            const errors: string[] = [];
            if (users.length === 0) {
                errors.push("有効なデータが入力されていません。");
            }
            // const newUserIds = users.map(x => x.id!.toLowerCase());
            const newUserIds = users.map(x => x.id!.endsWith("@" + qTenant.data?.prefix) ? x.id! : x.id! + ("@" + qTenant.data?.prefix));
            
            for(const [i, user] of users.entries()) {
                const index = i + 1;
                // idチェック
                if (!user.id) {
                    errors.push(`${index}件目: IDが入力されていません。`);
                } else {
                    let userId = user.id;
                    if(!userId.endsWith("@" + qTenant.data?.prefix)){
                        userId = user.id + "@" + qTenant.data?.prefix;
                    }
                    if (currentUserIds.has(userId)) {
                        errors.push(`${index}件目: 入力されたIDは既に使用されています。`);
                    } else if (newUserIds.slice(0, i).some(x => x === userId)) {
                        errors.push(`${index}件目: 入力されたIDは既に使用されています。`);
                    } else if (userId) {
                        if (cacheRef.current.has(userId)) {
                            if (!cacheRef.current.get(userId)) {
                                errors.push(`${index}件目: 入力されたIDは既に使用されています。`);
                            }
                        } else {
                            const isAvailable = await isUsernameAvailable(userId);
                            cacheRef.current.set(userId, isAvailable);
                            if (!isAvailable) {
                                errors.push(`${index}件目: 入力されたIDは既に使用されています。`);
                            }
                        }
                    }
                }

                // プレフィックスの自動追加
                // if(!user.id?.endsWith("@" + qTenant.data?.prefix))
                // {
                //     user.id = user.id + "@" + qTenant.data?.prefix;   
                // }             
                //user.id = user.id.toLowerCase();
                
                // プレフィックスの入力チェック
                if(user.id?.includes("@" + qTenant.data?.prefix))
                {
                    // 入力値に含まれている場合
                    const prefixCount = user.id.split("@" + qTenant.data?.prefix).length - 1;
                    if(prefixCount > 1)
                    {
                        // 入力値に複数プレフィックスが入力されている場合
                        errors.push(("@" + qTenant.data?.prefix) + "が複数入力されています。");
                    }
                }           
                else
                {
                    // 入力値に含まれていない場合
                    errors.push("末尾に" + ("@" + qTenant.data?.prefix) + "を入力してください。");
                }

                // 氏名チェック
                if (!user.name) {
                    errors.push(`${index}件目: 氏名が入力されていません。`);
                }

                // メールアドレスチェック
                user.email = qTenant.data?.email ? qTenant.data?.email : "";                
                if (!user.email) {
                    errors.push(`${index}件目: メールアドレスが入力されていません。`);
                } else {
                    if (!isValidEmail(user.email)) {
                        errors.push(`${index}件目: メールアドレスが正しくありません。`);
                    }
                }
            }
            setInputErrors(errors);
            if (errors.length > 0) {
                throw new Error("入力データにエラーがあります。");
            }

            // ユーザー作成
            setTotalCount(users.length);
            setCurrentCount(0);
            const createdUsers = [];
            for(const user of users) {
                createdUsers.push(await createReFindUser(user));
                setCurrentCount(x => x + 1);
            }
            return createdUsers;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("取り込みました。", { variant: "success" });

            // クエリのキャッシュを更新する
            queryClient.setQueryData<User[]>(queryKeys.graphqlUsersByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return [...items, ...data];
            });

            // 入力欄を初期化するため、このコンポーネントを再表示する
            update();
        },
        onError(error, _variables, _context) {
            // クエリを再読み込みする
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlUsersByTenantId(tenantId) });

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
                    sampleUrl="/csv/ユーザ一覧_テンプレート.csv"
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
                {mutation.isPending && totalCount > 0 && (
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
