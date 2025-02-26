"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Seat, SeatOccupancy } from "@/API";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ConfirmDialogState } from "@/hooks/confirmDialogState";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { releaseSeat } from "@/services/occupancyUtil";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "./hook";

export default function ReleaseSeatDialog(state: ConfirmDialogState<Seat>) {
    const tenantId = useTenantId();
    const today = useTodayYYYYMMDD();
    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            if (!state.data) {
                throw new Error("解放する座席が設定されていません。");
            }
            return await releaseSeat(state.data);
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("座席を解放しました。", { variant: "success" });

            // クエリのキャッシュを更新する
            queryClient.setQueryData<SeatOccupancy[]>(queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId), items => {
                if (!items) {
                    return items;
                }
                return [...items, data];
            });

            // ダイアログを閉じる
            state.close();
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
        <ConfirmDialog
            {...state}
            onConfirm={() => mutation.mutate()}
            isPending={mutation.isPending}
        />
    );
}
