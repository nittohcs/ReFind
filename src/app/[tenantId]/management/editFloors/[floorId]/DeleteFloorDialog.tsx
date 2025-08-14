"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Floor, Seat } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ConfirmDialogState } from "@/hooks/confirmDialogState";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { graphqlDeleteFile, graphqlDeleteFloor, graphqlDeleteSeat } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";

export default function DeleteFloorDialog(state: ConfirmDialogState<Floor>) {
    const tenantId = useTenantId();
    const {isReady, allSeats} = useSeatOccupancy();
    const router = useRouter();

    const [progressMessage, setProgressMessage] = useState("");
    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn() {
            const floor = state.data as Floor;
            const ret = {
                seats: [] as Seat[],
                floor: floor,
            };

            // 座席を削除
            const seats = allSeats.filter(seat => seat.floorId === floor.id);
            setProgressMessage("座席を削除中");
            setTotalCount(seats.length);
            setCurrentCount(0);
            for(const seat of seats) {
                ret.seats.push(await graphqlDeleteSeat({ id: seat.id }));
                setCurrentCount(x => x + 1);
            }

            setProgressMessage("フロアを削除中");
            setTotalCount(1);
            setCurrentCount(0);

            // 画像を削除
            const _result = await graphqlDeleteFile(floor.imagePath);

            // フロアを削除
            ret.floor = await graphqlDeleteFloor({ id: floor.id });

            setCurrentCount(1);

            return ret;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar(`フロア「${data.floor.name}」を削除しました。`, { variant: "success" });

            // クエリのキャッシュを更新
            const deletedSeatIds = data.seats.map(x => x.id);
            queryClient.setQueryData<Seat[]>(queryKeys.graphqlSeatsByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.filter(item => !deletedSeatIds.includes(item.id));
            });
            queryClient.setQueryData<Floor[]>(queryKeys.graphqlFloorsByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.filter(item => item.id !== data.floor.id);
            });

            // ダイアログを閉じる
            state.close();

            // フロア一覧に戻る
            router.push(`/${tenantId}/management/editFloors`);
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

    if (!isReady) {
        return null;
    }

    return (
        <ConfirmDialog
            {...state}
            onConfirm={() => mutation.mutate()}
            isPending={mutation.isPending}
            progressMessage={progressMessage}
            progressValue={progressValue}
            progressLabel={progressLabel}
        />
    );
}
