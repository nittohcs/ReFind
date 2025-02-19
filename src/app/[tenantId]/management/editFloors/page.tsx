"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useTenantId } from "../../hook";
import FloorsTable from "./FloorsTable";

export default function Page() {
    const tenantId = useTenantId();
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Typography>フロア編集</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <FloorsTable />
            </Box>
        </>
    );
}
