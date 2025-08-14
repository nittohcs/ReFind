"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import CreateTenantForm from "./CreateTenantForm";

export default function Page() {
    const [updatedAt, update] = useUpdatedAt("createTenant");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/sysAdmins">ホーム</Link>
                <Link href="/sysAdmins/tenants">テナント設定</Link>
                <Typography>登録</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <CreateTenantForm key={updatedAt} update={update} />
            </Box>
        </>
    );
}
