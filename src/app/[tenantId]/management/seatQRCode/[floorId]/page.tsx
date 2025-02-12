"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import SeatsTable from "./SeatsTable";

export default function Page({ params }: { params: { floorId: string } }) {
    const tenantId = useTenantId();
    const floorId = decodeURIComponent(params.floorId);
    const {isReady, allFloors, allSeats} = useSeatOccupancy();
    const floor = useMemo(() => allFloors.find(x => x.id === floorId) ?? null, [allFloors, floorId]);
    const seats = useMemo(() => allSeats.filter(x => x.floorId === floorId).toSorted((a, b) => a.name.localeCompare(b.name)), [allSeats, floorId]);

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/seatQRCode`}>座席のQRコード一覧</Link>
                <Typography>{floor?.name}</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>{floor?.name}</Typography>
                </Box>
            </Toolbar>
            {isReady && (
                <SeatsTable seats={seats} />
            )}
        </>
    )
}
