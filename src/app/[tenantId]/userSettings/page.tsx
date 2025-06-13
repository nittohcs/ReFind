"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useUpdatedAt } from "@/hooks/ui";
import { useTenantId } from "../hook";
import ConfirmUserSettingsForm from "./ConfirmUserSettingsForm";
import EditUserSettingsForm from "./EditUserSettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function Page() {
    const tenantId = useTenantId();
    const [confirmingEmail, setConfirmingEmail] = useState("");
    // [変数, 関数] = 初期値
    const [updatedAt_user, update_user] = useUpdatedAt("user");
    const [updatedAt_password, update_password] = useUpdatedAt("password");

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>設定</Typography>
            </MiraCalBreadcrumbs>
            <Box pt={2}>
                {confirmingEmail ? (
                    <ConfirmUserSettingsForm
                        update={update_user}
                        confirmingEmail={confirmingEmail}
                        setConfirmingEmail={setConfirmingEmail}
                    />
                ) : (
                    <>
                        <EditUserSettingsForm
                            key={updatedAt_user} // 型定義？
                            update={update_user}
                            // confirmingEmail={confirmingEmail}
                            setConfirmingEmail={setConfirmingEmail}
                        />
                        <ChangePasswordForm
                            key={updatedAt_password} // 型定義？
                            update={update_password}
                        />
                    </>
                )}
            </Box>
        </>
    );
}
