"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useTenantId } from "../../hook";
import SeatOccupanciesTable from "./SeatOccupanciesTable";

export default function Page() {
    const tenantId = useTenantId();
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Typography>座席確保履歴一覧</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <SeatOccupanciesTable />
            </Box>
        </>
    );
}
