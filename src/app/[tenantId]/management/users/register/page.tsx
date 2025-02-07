"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import RegisterUserForm from "./RegisterUserForm";

export default function Page() {
    const tenantId = useTenantId();
    const [updatedAt, update] = useUpdatedAt("createUser");
    
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/users/`}>ユーザー編集</Link>
                <Typography>登録</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>登録</Typography>
                </Box>
            </Toolbar>
            <RegisterUserForm key={updatedAt} update={update} />
        </>
    );
}
