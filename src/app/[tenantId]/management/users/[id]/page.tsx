"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import EditUserForm from "./EditUserForm";

export default function Page({ params }: { params: { id: string } }) {
    const tenantId = useTenantId();
    const id = decodeURIComponent(params.id);
    const [updatedAt, update] = useUpdatedAt("editUser");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Link href={`/${tenantId}/management/users/`}>ユーザー編集</Link>
                <Typography>{id}</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <EditUserForm key={updatedAt} id={id} update={update} />
            </Box>
        </>
    );
}
