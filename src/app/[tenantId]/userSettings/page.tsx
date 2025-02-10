"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import { useTenantId } from "../hook";
import ConfirmUserSettingsForm from "./ConfirmUserSettingsForm";
import EditUserSettingsForm from "./EditUserSettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function Page() {
    const tenantId = useTenantId();
    const [confirmingEmail, setConfirmingEmail] = useState("");
    const [updatedAt_user, update_user] = useUpdatedAt("user");
    const [updatedAt_password, update_password] = useUpdatedAt("password");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>設定</Typography>
            </MiraCalBreadcrumbs>
            <Container maxWidth="sm" sx={{ py: 1 }}>
                <Stack spacing={4}>
                    <Typography variant="h5">設定</Typography>
                    {confirmingEmail ? (
                        <ConfirmUserSettingsForm
                            update={update_user}
                            confirmingEmail={confirmingEmail}
                            setConfirmingEmail={setConfirmingEmail}
                        />
                    ) : (
                        <>
                            <EditUserSettingsForm
                                key={updatedAt_user}
                                update={update_user}
                                // confirmingEmail={confirmingEmail}
                                setConfirmingEmail={setConfirmingEmail}
                            />
                            <ChangePasswordForm
                                key={updatedAt_password}
                                update={update_password}
                            />
                        </>
                    )}
                </Stack>
            </Container>
        </>
    );
}
