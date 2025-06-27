"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalCheckbox from "@/components/MiraCalCheckbox";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useAuthState } from "@/hooks/auth";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { addUserToGroup, removeUserFromGroup } from "@/services/AdminQueries";
import { queryKeys } from "@/services/queryKeys";
import { ReFindUser } from "@/types/user";
import { useTenantId } from "../../hook";

type FormValues = {
    isAdmin: boolean,
};

type BulkEditUserDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: ReFindUser[] | null,
    resetRowSelection: () => void,
};

export const BulkEditUserDialog: FC<BulkEditUserDialogProps> = ({
    isOpened,
    close,
    data,
    resetRowSelection,
}) => {
    const tenantId = useTenantId();
    const authState = useAuthState();
    const validationSchema = useMemo(() => yup.object().shape({
        isAdmin: yup.bool().required().default(false).test("isAdmin", "操作中のユーザーを管理者から外すことはできません", value => {
            if (!value) {
                return !(data ?? []).some(x => x.id === authState.username);
            }
            return true;
        }),
    }), [data, authState.username]);

    const initialValues = useMemo(() => validationSchema.cast({

    }), [validationSchema]);

    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            setTotalCount((data ?? []).length);
            setCurrentCount(0);
            for(const user of (data ?? [])) {
                if (values.isAdmin) {
                    if (user.isAdmin) {
                        // 元々管理者なので何もしない
                    } else {
                        // 管理者にする
                        await removeUserFromGroup(user.id, "users");
                        await addUserToGroup(user.id, "admins");
                    }
                } else {
                    if (user.isAdmin) {
                        // 一般ユーザーにする
                        await removeUserFromGroup(user.id, "admins");
                        await addUserToGroup(user.id, "users");
                    } else {
                        // 元々一般ユーザーなので何もしない
                    }
                }
                setCurrentCount(x => x + 1);
            }
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("保存しました。", { variant: "success" });

            // クエリが再取得されるようにする
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlUsersByTenantId(tenantId) });

            // テーブルの行選択をリセット
            resetRowSelection();

            // ダイアログを閉じる
            close();
        },
        onError(error, _variables, _context) {
            // クエリが再取得されるようにする
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
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => !mutation.isPending && close()}>
            <DialogTitle>ユーザー一括設定</DialogTitle>
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm disablePadding disableGap>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <MiraCalCheckbox
                            name="isAdmin"
                            label="管理者"
                        />
                        {mutation.isPending && (
                            <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            保存
                        </MiraCalButton>
                        <MiraCalButton
                            variant="contained"
                            onClick={close}
                            disabled={mutation.isPending}
                        >
                            キャンセル
                        </MiraCalButton>
                    </DialogActions>
                </MiraCalForm>
            </Formik>
        </Dialog>
    );
};
export default BulkEditUserDialog;
