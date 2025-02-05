"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import CreateTenantForm from "./CreateTenantForm";

export default function Page() {
    const [updatedAt, update] = useUpdatedAt("createTenant");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/sysAdmins">ホーム</Link>
                <Link href="/sysAdmins/tenants">テナント編集</Link>
                <Typography>登録</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>登録</Typography>
                </Box>
            </Toolbar>
            <Box>
                <CreateTenantForm key={updatedAt} update={update} />
            </Box>
        </>
    );
}
