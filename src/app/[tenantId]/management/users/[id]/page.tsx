"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import EditUserForm from "./EditUserForm";

export default function Page({ params }: { params: { id: string } }) {
    const tenantId = useTenantId();
    const id = decodeURIComponent(params.id);

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/users/`}>ユーザー編集</Link>
                <Typography>{id}</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>{id}</Typography>
                </Box>
            </Toolbar>
            <EditUserForm id={id} />
        </>
    );
}
