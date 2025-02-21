"use client";

import Link from "next/link";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useTenantId } from "../hook";

export default function Page() {
    const tenantId = useTenantId();
    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>管理</Typography>
            </MiraCalBreadcrumbs>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                <Link href={`/${tenantId}/management/editFloors`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">フロア編集</Typography>
                            <Typography variant="caption">マップ、座席サイズの設定を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">設定を行う</Button>
                        </CardActions>
                    </Card>
                </Link>
                <Link href={`/${tenantId}/management/users`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">ユーザー編集</Typography>
                            <Typography variant="caption">ユーザーの設定を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">設定を行う</Button>
                        </CardActions>
                    </Card>
                </Link>
                <Link href={`/${tenantId}/management/seatQRCode`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">座席のQRコード一覧</Typography>
                            <Typography variant="caption">座席QRコードの印刷を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">設定を行う</Button>
                        </CardActions>
                    </Card>
                </Link>
                <Link href={`/${tenantId}/management/seatOccupancies`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">座席確保履歴一覧</Typography>
                            <Typography variant="caption">座席確保履歴の一覧を表示する</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">設定を行う</Button>
                        </CardActions>
                    </Card>
                </Link>
            </Box>
        </>
    )
}
