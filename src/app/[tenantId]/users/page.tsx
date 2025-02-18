"use client"

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useTenantId } from "../hook";
import UsersTable from "./UsersTable";

export default function Page() {
    const tenantId = useTenantId();
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>ユーザー</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <UsersTable />
            </Box>
        </>
    );
}
