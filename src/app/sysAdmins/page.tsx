"use client";

import Link from "next/link";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useAuthState } from "@/hooks/auth";

export default function Page() {
    const authState = useAuthState();
    return (
        <>
            <Typography variant="h5">{`ようこそ、${authState.name}さん！`}</Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                <Link href="/sysAdmins/tenants">
                    <Card>
                        <CardContent>
                            <Typography variant="h6">テナント設定</Typography>
                            <Typography variant="caption">テナントの設定を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">システム管理者専用</Button>
                        </CardActions>
                    </Card>
                </Link>
                <Link href="/sysAdmins/uploadManual">
                    <Card>
                        <CardContent>
                            <Typography variant="h6">ドキュメント設定</Typography>
                            <Typography variant="caption">ドキュメントの設定を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">システム管理者専用</Button>
                        </CardActions>
                    </Card>
                </Link>
            </Box>
        </>
    );
}
