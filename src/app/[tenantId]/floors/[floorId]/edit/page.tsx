"use client";

import { useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { Seat } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import SeatBox from "@/components/SeatBox";
import { useStorageFileURL } from "@/hooks/storage";
import { useContentsSize, useDialogState, useDialogStateWithData } from "@/hooks/ui";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import CreateSeatDialog from "./CreateSeatDialog";
import EditSeatDialog from "./EditSeatDialog";
import ImportCSVDialog from "./ImportCSVDialog";

export default function Page({ params }: { params: { floorId: string } }) {
    const tenantId = useTenantId();
    const floorId = decodeURIComponent(params.floorId);
    const {isReady, allFloors, allSeats} = useSeatOccupancy();
    const floor = useMemo(() => allFloors.find(x => x.id === floorId) ?? null, [allFloors, floorId]);
    const seats = useMemo(() => allSeats.filter(x => x.floorId === floorId), [allSeats, floorId]);

    const createDialogState = useDialogStateWithData<Seat>();
    const editDialogState = useDialogStateWithData<Seat>();

    const imageRef = useRef<HTMLImageElement>(null);
    const handleImageClick = useCallback((event: React.MouseEvent) => {
        if (!imageRef.current) {
            return;
        }
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const rect = imageRef.current.getBoundingClientRect();
        const imgX = rect.left;
        const imgY = rect.top;

        const relativeX = Math.round(mouseX - imgX);
        const relativeY = Math.round(mouseY - imgY);

        // floorId, posX, posYしか使わないけど、他の項目も必須設定なので仕方なく空文字とかを設定している
        const seat: Seat = {
            __typename: "Seat",
            id: "",
            tenantId: tenantId,
            floorId: floorId,
            name: "",
            posX: relativeX,
            posY: relativeY,
            createdAt: "",
            updatedAt: "",
        };
        createDialogState.open(seat);
    }, [tenantId, floorId, createDialogState]);

    const handleSeatClick = useCallback((seat: Seat) => {
        editDialogState.open(seat);
    }, [editDialogState]);

    const imageQuery = useStorageFileURL(floor?.imagePath ?? "");

    const handleCSVExport = useCallback(() => {
        if (seats.length === 0) {
            return;
        }

        const convertToCSV = (data: Seat[]) => {
            const headers = Object.keys(data[0]).join(",");
            const rows = data.map(item => Object.values(item).join(","));
            return [headers, ...rows].join("\n");
        };

        const csvData = convertToCSV(seats);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [seats]);

    const state = useDialogState();

    const { elementRef, contentsWidth, contentsHeight } = useContentsSize();

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/floors`}>座席</Link>
                <Link href={`/${tenantId}/floors/${floor?.id}`}>{floor?.name}</Link>
                <Typography>座席編集</Typography>
            </MiraCalBreadcrumbs>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1} pt={2} ref={elementRef}>
                <Button
                    variant="contained"
                    onClick={handleCSVExport}
                    disabled={!isReady}
                >
                    CSVエクスポート
                </Button>
                {isReady && floor && (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => state.open()}
                        >
                            CSVインポート
                        </Button>
                        <ImportCSVDialog {...state} floor={floor} seats={seats} />
                    </>
                )}
            </Box>
            {isReady && floor && imageQuery.isFetched && imageQuery.data && (
                <>
                    <Box sx={{ position: "relative", overflow: "auto", width: { xs: contentsWidth - 8, sm: contentsWidth - 16 }, height: contentsHeight }}>
                        <Image
                            src={imageQuery.data}
                            alt="座席表"
                            width={floor.imageWidth}
                            height={floor.imageHeight}
                            ref={imageRef}
                            onClick={handleImageClick}
                        />
                        {seats.map(seat => (
                            <SeatBox
                                key={seat.id}
                                seat={seat}
                                onClick={() => handleSeatClick(seat)}
                            >
                                {seat.name}
                            </SeatBox>
                        ))}
                    </Box>
                    <CreateSeatDialog
                        {...createDialogState}
                        imageWidth={floor.imageWidth}
                        imageHeight={floor.imageHeight}
                    />
                    <EditSeatDialog
                        {...editDialogState}
                        imageWidth={floor.imageWidth}
                        imageHeight={floor.imageHeight}
                    />
                </>
            )}
        </>
    );
}
