"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Toolbar, Typography } from "@mui/material";
import { Seat, SeatOccupancy } from "@/API";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import DebouncedTextField from "@/components/DebouncedTextField";
import { SeatBox } from "@/components/SeatBox";
import { useAuthState } from "@/hooks/auth";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useStorageFileURL } from "@/hooks/storage";
import { useContentsSize, useDialogStateWithData, useEnqueueSnackbar } from "@/hooks/ui";
import { useTenantId } from "../../hook";
import { ConfirmDialog, ConfirmDialogData } from "./ConfirmDialog";

export default function Page({ params }: { params: { floorId: string } }) {
    const tenantId = useTenantId();
    const floorId = decodeURIComponent(params.floorId);
    const authState = useAuthState();
    const {isReady, myOccupancy, mySeat, myFloor, seatOccupancyMap, allFloors, allSeats} = useSeatOccupancy();
    const floor = useMemo(() => allFloors.find(x => x.id === floorId) ?? null, [allFloors, floorId]);
    const seats = useMemo(() => allSeats.filter(x => x.floorId === floorId), [allSeats, floorId]);

    const confirmDialogState = useDialogStateWithData<ConfirmDialogData>();

    const enqueueSnackbar = useEnqueueSnackbar();
    const handleSeatClick = useCallback((seat: Seat, occupancy: SeatOccupancy | null) => {
        // 既に座席が使用中
        if (occupancy && occupancy.userId) {
            if (occupancy === myOccupancy) {
                // 自分が使用中
                enqueueSnackbar("選択した座席を使用中です。", { variant: "info" });
                return;
            } else {
                // 他人が使用中
                if (authState.groups?.admins) {
                    confirmDialogState.open({
                        title: "座席強制解放",
                        message: `選択した座席は${occupancy.userName}が使用中です。座席を強制解放します。`,
                        newSeat: null,
                        oldSeat: seat,
                        userId: authState.username ?? "",
                        userName: authState.name ?? "",
                    });
                } else {
                    enqueueSnackbar(`選択した座席は${occupancy.userName}が使用中です。`, { variant: "error" });
                }
                return;
            }
        }

        if (mySeat) {
            confirmDialogState.open({
                title: "座席変更",
                message: `フロア「${myFloor?.name}」の座席「${mySeat.name}」を解放し、フロア「${floor?.name}」の座席「${seat.name}」を確保します。`,
                newSeat: seat,
                oldSeat: mySeat,
                userId: authState.username ?? "",
                userName: authState.name ?? "",
            });
        } else {
            confirmDialogState.open({
                title: "座席確保",
                message: `フロア「${floor?.name}」の座席「${seat.name}」を確保します。`,
                newSeat: seat,
                oldSeat: null,
                userId: authState.username ?? "",
                userName: authState.name ?? "",
            });
        }
    }, [myOccupancy, mySeat, enqueueSnackbar, confirmDialogState, authState.username, authState.name, authState.groups?.admins, myFloor, floor?.name]);

    const imageQuery = useStorageFileURL(floor?.imagePath ?? "");

    const router = useRouter();
    const searchParams = useSearchParams();
    const [filterString, setFilterString] = useState(() => searchParams.get("filter") || "");
    const handleChange = useCallback((s: string) => {
        const urlSearchParams = new URLSearchParams(searchParams);
        if (s) {
            urlSearchParams.set("filter", s);
        } else {
            urlSearchParams.delete("filter");
        }
        router.replace(`/${tenantId}/floors/${params.floorId}?${urlSearchParams.toString()}`);
        setFilterString(s);
    }, [searchParams, router, params.floorId]);

    const { elementRef, contentsWidth, contentsHeight } = useContentsSize();

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/floors`}>座席</Link>
                <Typography>{floor?.name}</Typography>
            </MiraCalBreadcrumbs>
            <Box>
                <Toolbar variant="dense" sx={{ pt: 2 }}>
                    <Typography variant="h5" flexGrow={1}>
                        {floor?.name}
                    </Typography>
                </Toolbar>
            </Box>
            {authState.groups?.admins && floor && (
                <Link href={`/${tenantId}/floors/${floor.id}/edit`}>
                    <Button
                        variant="contained"
                    >
                        座席編集
                    </Button>
                </Link>
            )}
            {isReady && floor && imageQuery.isFetched && imageQuery.data && (
                <>
                    <Box ref={elementRef}>
                        <Toolbar disableGutters>
                            <DebouncedTextField
                                variant="filled"
                                label="検索"
                                size="small"
                                // autoFocus
                                value={filterString}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Toolbar>
                    </Box>
                    <Box sx={{ position: "relative", overflow: "auto", width: { xs: contentsWidth - 8, sm: contentsWidth - 16 }, height: contentsHeight }}>
                        <Image
                            src={imageQuery.data}
                            alt="座席表"
                            width={floor.imageWidth}
                            height={floor.imageHeight}
                        />
                        {seats.map(seat => {
                            const occupancy = seatOccupancyMap.get(seat.id) ?? null;
                            let name = occupancy?.userName ?? null;
                            if (filterString && !name?.includes(filterString)) {
                                name = null;
                            }
                            return (
                                <SeatBox
                                    key={seat.id}
                                    seat={seat}
                                    isChangeColor={!!name}
                                    onClick={() => handleSeatClick(seat, occupancy)}
                                >
                                    {name ?? seat.name}
                                </SeatBox>
                            );
                        })}
                        <ConfirmDialog {...confirmDialogState} />
                    </Box>
                </>
            )}
        </>
    );
}