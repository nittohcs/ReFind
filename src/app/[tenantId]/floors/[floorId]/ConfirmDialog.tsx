"use client";

import { FC } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Seat, SeatOccupancy } from "@/API";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { occupySeat, releaseSeat } from "@/services/occupancyUtil";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "../../hook";

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
    data: dialogData,
}) => {
    const tenantId = useTenantId();
    const today = useTodayYYYYMMDD();

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            if (!dialogData) {
                throw new Error("ダイアログのデータが設定されていません。");
            }

            const ret: SeatOccupancy[] = [];
            if (dialogData.oldSeat) {
                ret.push(await releaseSeat(dialogData.oldSeat));
            }

            if (dialogData.newSeat) {
                ret.push(await occupySeat(dialogData.newSeat, dialogData.userId, dialogData.userName));
            }

            return ret;
        },
        onSuccess(data, _variables, _context) {
            if (dialogData?.oldSeat) {
                if (dialogData?.newSeat) {
                    enqueueSnackbar("座席を変更しました。", { variant: "success" });
                } else {
                    enqueueSnackbar("座席を解放しました。", { variant: "success" });
                }
            } else {
                enqueueSnackbar("座席を確保しました。", { variant: "success" });
            }

            // クエリのキャッシュに登録したデータを追加
            queryClient.setQueryData(queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId), (items: SeatOccupancy[] = []) => [...items, ...data]);

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
            <DialogTitle>{dialogData?.title}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DialogContentText>{dialogData?.message}</DialogContentText>
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
