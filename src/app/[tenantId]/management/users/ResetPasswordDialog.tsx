"use client";

import { FC, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { ReFindUser } from "@/types/user";
import { adminSetUserPassword } from "@/services/AdminQueries";
import { useGetTenant } from "@/services/graphql";
import { useTenantId } from "../../hook";

type ResetPasswordDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: ReFindUser[] | null,
    resetRowSelection: () => void,
};

export const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({
    isOpened,
    close,
    data,
    resetRowSelection,
}) => {
    const tenantId = useTenantId();
    const qTenant = useGetTenant(tenantId);

    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const mutation = useMutation({
        async mutationFn() {
            const users = data ?? [];
            setTotalCount(users.length);
            setCurrentCount(0);
            for(const user of users) {
                await adminSetUserPassword(user, qTenant.data!.initialPassword);
                setCurrentCount(x => x + 1);
            }
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("選択したユーザーのパスワードをリセットしました。", { variant: "success" });

            // テーブルの行選択をリセット
            resetRowSelection();

            // ダイアログを閉じる
            close();
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

    if (!qTenant.isFetched || !qTenant.data) {
        return null;
    }

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => !mutation.isPending && close()}>
            <DialogTitle>パスワードリセット</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DialogContentText>
                    選択したユーザーのパスワードを初期パスワードにリセットします。
                </DialogContentText>
                {mutation.isPending && (
                    <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    variant="contained"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    パスワードリセット
                </Button>
                <Button
                    variant="contained"
                    onClick={close}
                    disabled={mutation.isPending}
                >
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    )
};
export default ResetPasswordDialog;
