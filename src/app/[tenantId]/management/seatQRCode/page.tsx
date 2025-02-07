"use client";

import Link from "next/link";
import { Box, Card, CardContent, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useTenantId } from "../../hook";

export default function Page() {
    const tenantId = useTenantId();
    const {isReady, allFloors} = useSeatOccupancy();

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Link href={`/${tenantId}/management`}>管理</Link>
                <Typography>座席のQRコード一覧</Typography>
            </MiraCalBreadcrumbs>
            <Toolbar sx={{ pt: 2 }}>
                <Box display="flex" flexGrow={1} gap={1}>
                    <Typography variant="h5" flexGrow={1}>座席のQRコード一覧</Typography>
                </Box>
            </Toolbar>
            {isReady && (
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                    {allFloors.toSorted((a, b) => a.name.localeCompare(b.name)).map(floor => (
                        <Link key={floor.id} href={`/${tenantId}/management/seatQRCode/${floor.id}`}>
                            <Card>
                                <CardContent>
                                    <Typography>{floor.name}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {allFloors.length === 0 && (
                        <Typography>フロアが存在しません。</Typography>
                    )}
                </Box>
            )}
        </>
    )
}
