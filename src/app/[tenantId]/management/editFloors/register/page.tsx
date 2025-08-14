"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import CreateFloorForm from "./CreateFloorForm";

export default function Page() {
    const tenantId = useTenantId();
    const [updatedAt, update] = useUpdatedAt("createFloor");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/editFloors`}>フロア設定</Link>
                <Typography>登録</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <CreateFloorForm key={updatedAt} update={update} />
            </Box>
        </>
    );
}
