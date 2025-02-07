"use client";

import { FC, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { queryKeys } from "@/services/queryKeys";
import { ReFindUser } from "@/types/user";
import { releaseSeatBySeatId } from "@/services/occupancyUtil";

type ReleaseSeatDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: ReFindUser[] | null,

    resetRowSelection: () => void,
};

export const ReleaseSeatDialog: FC<ReleaseSeatDialogProps> = ({
    isOpened,
    close,
    data,
    resetRowSelection
}) => {
    const today = useTodayYYYYMMDD();

    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            const processUsers = data?.filter(x => x.seatId) ?? [];

            setTotalCount(processUsers.length);
            setCurrentCount(0);
            const ret = [];
            for(const user of processUsers) {
                if (user.seatId) {
                    ret.push(await releaseSeatBySeatId(user.seatId));
                }
                setCurrentCount(x => x + 1);
            }
            return ret;
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("座席を強制解放しました。", { variant: "success" });

            // SeatOccupancy取得クエリを無効化してを再取得されるようにする
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlSeatOccupanciesByDate(today) });

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
            for (const e of tmp.errors) {
                enqueueSnackbar(e.message, { variant: "error" });
            }
        },
    });
    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={close}>
            <DialogTitle>座席強制解放</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column" , gap: 2 }}>
                <DialogContentText>{`選択中の${data?.length}件のユーザーの確保している座席を強制解放します。`}</DialogContentText>
                {mutation.isPaused && (
                    <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                )}
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
export default ReleaseSeatDialog;
