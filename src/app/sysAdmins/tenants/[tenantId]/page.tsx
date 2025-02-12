"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import EditTenantForm from "./EditTenantForm";

export default function Page({ params }: { params: { tenantId: string } }) {
    const tenantId = decodeURIComponent(params.tenantId);
    const [updatedAt, update] = useUpdatedAt("editTenant");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/sysAdmins">ホーム</Link>
                <Link href="/sysAdmins/tenants">テナント</Link>
                <Typography>{tenantId}</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>{tenantId}</Typography>
                </Box>
            </Toolbar>
            <Box>
                <EditTenantForm key={updatedAt} tenantId={tenantId} update={update} />
            </Box>
        </>
    );
}
