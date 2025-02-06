"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import EditFloorForm from "./EditFloorForm";
import { useUpdatedAt } from "@/hooks/ui";

export default function Page({ params }: { params: { floorId: string } }) {
    const floorId = decodeURIComponent(params.floorId);
    const [updatedAt, update] = useUpdatedAt("editFloor");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/">ホーム</Link>
                <Link href="/management">管理</Link>
                <Link href="/management/editFloors">フロア編集</Link>
                <Typography>{floorId}</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>{floorId}</Typography>
                </Box>
            </Toolbar>
            <Box>
                <EditFloorForm key={updatedAt} floorId={floorId} update={update}/>
            </Box>
        </>
    );
}
