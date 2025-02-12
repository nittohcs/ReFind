"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
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
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>フロア編集</Typography>
                </Box>
            </Toolbar>
            <Box>
                <FloorsTable />
            </Box>
        </>
    );
}
