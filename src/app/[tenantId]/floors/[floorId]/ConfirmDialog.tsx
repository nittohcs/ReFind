"use client";

import { FC } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Seat } from "@/API";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { queryKeys } from "@/services/queryKeys";
import { occupySeat, releaseSeat } from "@/services/occupancyUtil";

export type ConfirmDialogData = {
    title: string,
    message: string,
    newSeat: Seat | null,
    oldSeat: Seat | null,
    userId: string,
    userName: string,
};

type ConfirmDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: ConfirmDialogData | null,
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
    isOpened,
    close,
    data,
}) => {
    const today = useTodayYYYYMMDD();

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            if (!data) {
                return;
            }

            if (data.oldSeat) {
                await releaseSeat(data.oldSeat);
            }

            if (data.newSeat) {
                await occupySeat(data.newSeat, data.userId, data.userName);
            }
        },
        onSuccess(_data, _variables, _context) {
            if (data?.oldSeat) {
                if (data?.newSeat) {
                    enqueueSnackbar("座席を変更しました。", { variant: "success" });
                } else {
                    enqueueSnackbar("座席を解放しました。", { variant: "success" });
                }
            } else {
                enqueueSnackbar("座席を確保しました。", { variant: "success" });
            }

            // 座席取得クエリを無効化して再取得されるようにする
            //queryClient.invalidateQueries({ queryKey: queryKeys.graphqlSeatOccupanciesByDate(today) });

            // TODO 変更したデータでクエリのキャッシュを更新する

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
            for (const e of tmp.errors) {
                enqueueSnackbar(e.message, { variant: "error" });
            }
        },
    });

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={close}>
            <DialogTitle>{data?.title}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DialogContentText>{data?.message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    variant="contained"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    OK
                </Button>
                <Button
                    variant="contained"
                    onClick={close}
                >
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;
