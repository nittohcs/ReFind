"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
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
            <Box pt={2}>
                <EditTenantForm key={updatedAt} tenantId={tenantId} update={update} />
            </Box>
        </>
    );
}
