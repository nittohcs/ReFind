"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import BulkImportForm from "./BulkImportForm";

export default function Page() {
    const tenantId = useTenantId();
    const [updatedAt, update] = useUpdatedAt("createUsers");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/users/`}>ユーザー編集</Link>
                <Typography>一括取込</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <BulkImportForm key={updatedAt} update={update} />
            </Box>
        </>
    );
}
