"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import TenantsTable from "./TenantsTable";

export default function Page() {
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/sysAdmins">ホーム</Link>
                <Typography>テナント設定</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <TenantsTable />
            </Box>
        </>
    );
}
