"use client";

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import TenantsTable from "./TenantsTable";

export default function Page() {
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/sysAdmins">ホーム</Link>
                <Typography>テナント</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>テナント</Typography>
                </Box>
            </Toolbar>
            <Box>
                <TenantsTable />
            </Box>
        </>
    );
}
