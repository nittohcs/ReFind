"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import EditFloorForm from "./EditFloorForm";

export default function Page({ params }: { params: { floorId: string } }) {
    const tenantId = useTenantId();
    const floorId = decodeURIComponent(params.floorId);
    const [updatedAt, update] = useUpdatedAt("editFloor");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/editFloors`}>フロア設定</Link>
                <Typography>{floorId}</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <EditFloorForm key={updatedAt} floorId={floorId} update={update}/>
            </Box>
        </>
    );
}
