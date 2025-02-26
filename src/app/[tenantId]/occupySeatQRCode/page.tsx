"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { SeatOccupancy } from "@/API";
import QRCodeReader from "@/components/QRCodeReader";
import { useAuthState } from "@/hooks/auth";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { occupySeat, releaseSeat } from "@/services/occupancyUtil";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "../hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";

export default function Page() {
    const tenantId = useTenantId();
    const today = useTodayYYYYMMDD();
    const authState = useAuthState();
    const { isReady, myOccupancy, mySeat, myFloor, allSeats, seatOccupancyMap, allFloors } = useSeatOccupancy();

    const queryClient = useQueryClient();

    const enqueueSnackbar = useEnqueueSnackbar();
    const router = useRouter();
    const onRead = useCallback(async (seatId: string)=> {
        // seatIdに対応するSeatが存在するかチェック
        const seat = allSeats.find(x => x.id === seatId) ?? null;
        if (!seat) {
            enqueueSnackbar(`無効なQRコードが読み込まれました。`, { variant: "error" });
            router.push(`/${tenantId}`);
            return true;
        }

        const floor = allFloors.find(x => x.id === seat.floorId) ?? null;
        if (!floor) {
            enqueueSnackbar(`座席「${seat.name}」に対応するフロアが存在しません。`, { variant: "error" });
            router.push(`/${tenantId}`);
            return true;
        }

        const occupancy = seatOccupancyMap.get(seatId) ?? null;
        if (occupancy && occupancy.userId) {
            if (occupancy === myOccupancy) {
                // 自分が使用中
                enqueueSnackbar(`フロア「${floor.name}」の座席「${seat.name}」はあなたが使用中です。`, { variant: "info" });
            } else {
                enqueueSnackbar(`フロア「${floor.name}」の座席「${seat.name}」は${occupancy.userName}が使用中です。`, { variant: "error" });
            }
            router.push(`/${tenantId}`);
            return true;
        }

        const occupancies: SeatOccupancy[] = [];
        if (mySeat) {
            occupancies.push(await releaseSeat(mySeat));
            occupancies.push(await occupySeat(seat, authState.username ?? "", authState.name ?? ""));
            enqueueSnackbar(`フロア「${myFloor?.name}」の座席「${mySeat.name}」を解放し、フロア「${floor.name}」の座席「${seat.name}」を確保しました。`, { variant: "success" });
        } else {
            occupancies.push(await occupySeat(seat, authState.username ?? "", authState.name ?? ""));
            enqueueSnackbar(`フロア「${floor.name}」の座席「${seat.name}」を確保しました。`, { variant: "success" });
        }
        queryClient.setQueryData<SeatOccupancy[]>(queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId), items => {
            if (!items) {
                return items;
            }
            return [...items, ...occupancies];
        });
        router.push(`/${tenantId}/floors/${floor.id}`);
        return true;
    }, [allSeats, authState.name, authState.username, enqueueSnackbar, myOccupancy, mySeat, router, seatOccupancyMap, queryClient, today, allFloors, myFloor, tenantId]);

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>QRコード読込</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                {isReady && (
                    <QRCodeReader onRead={onRead} />
                )}
            </Box>
        </>
    );
}
