"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "aws-amplify/storage";
import { Floor } from "@/API";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ConfirmDialogState } from "@/hooks/confirmDialogState";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { graphqlDeleteFloor } from "../operation";

export default function DeleteFloorDialog(state: ConfirmDialogState<Floor>) {
    const router = useRouter();
    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            const floor = state.data as Floor;

            // ストレージから画像を削除する
            const _result = await remove({ path: floor.imagePath });

            // テーブルからレコードを削除する
            return await graphqlDeleteFloor({
                id: floor.id,
            });
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar(`フロア「${data.name}」を削除しました。`, { variant: "success" });

            // フロア取得クエリを無効化して再取得されるようにする
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlListAllFloors });

            // ダイアログを閉じる
            state.close();

            // フロア一覧に戻る
            router.push("/management/editFloors");
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
