"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import EditManualForm from "./EditManualForm";

export default function Page() {
    const [updatedAt, update] = useUpdatedAt("editManual");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href="/sysAdmins">ホーム</Link>
                <Typography>マニュアル編集</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                <EditManualForm key={updatedAt} update={update} />
            </Box>
        </>
    );
}
