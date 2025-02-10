"use client"

import Link from "next/link";
import { Box, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useReFindUsers } from "@/hooks/ReFindUser";
import { useTenantId } from "../hook";
import UsersTable from "./UsersTable";

export default function Page() {
    const tenantId = useTenantId();
    const query = useReFindUsers();
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>ユーザー</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>ユーザー</Typography>
                </Box>
            </Toolbar>
            <Box>
                {query.isLoading && (
                    <p>loading...</p>
                )}
                {query.isFetched && (
                    <UsersTable />
                )}
            </Box>
        </>
    );
}
