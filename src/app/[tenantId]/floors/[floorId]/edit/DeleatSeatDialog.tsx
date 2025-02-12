"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Seat } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ConfirmDialogState } from "@/hooks/confirmDialogState";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { graphqlDeleteSeat } from "./operation";

type DeleteSeatDialogProps = ConfirmDialogState<Seat> & {
    closeParentDialog: () => void,
};

export default function DeleteSeatDialog(
   state: DeleteSeatDialogProps
) {
    const tenantId = useTenantId();
    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            const seat = await graphqlDeleteSeat({
                id: state.data?.id ?? "",
            });
            return seat;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar(`座席「${data.name}」を削除しました。`, { variant: "success" });

            // クエリのキャッシュから削除したデータを除外する
            queryClient.setQueryData(queryKeys.graphqlSeatsByTenantId(tenantId), (items: Seat[] = []) => items.filter(x => x.id !== data.id));

            // ダイアログを閉じる
            state.close();
            state.closeParentDialog();
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

    return (
        <ConfirmDialog
            {...state}
            onConfirm={() => mutation.mutate()}
            isPending={mutation.isPending}
        />
    );
}
