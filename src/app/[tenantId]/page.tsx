"use client";

import Link from "next/link";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useAuthState } from "@/hooks/auth";
import { useTenantId } from "./hook";

export default function Page() {
    const tenantId = useTenantId();

    const authState = useAuthState();
    if (!authState.username) {
        return <></>;
    }
    return (
        <>
            <Typography variant="h5">{`ようこそ、${authState.name}さん！`}</Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                <Link href={`/${tenantId}/floors`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">座席</Typography>
                            <Typography variant="caption">座席確認、座席確保を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">座席確認、座席確保する</Button>
                        </CardActions>
                    </Card>
                </Link>
                <Link href={`/${tenantId}/occupySeatQRCode`} hidden>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">座席QR読込</Typography>
                            <Typography variant="caption">座席QRコードを読込して座席確保を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">QRコードを読込する</Button>
                        </CardActions>
                    </Card>
                </Link>
                <Link href={`/${tenantId}/users`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">ユーザー</Typography>
                            <Typography variant="caption">ユーザーの所在確認を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">所在確認する</Button>
                        </CardActions>
                    </Card>
                </Link>
                {authState.groups?.admins && (
                    <Link href={`/${tenantId}/management`}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">管理</Typography>
                                <Typography variant="caption">システムの設定を行う</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">設定を行う（管理者専用）</Button>
                            </CardActions>
                        </Card>
                    </Link>
                )}
            </Box>
        </>
    );
}
