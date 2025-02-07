"use client";

import Link from "next/link";
import { Box, Card, CardContent, Toolbar, Typography } from "@mui/material";
import MiraCalBreadcrumbs from "@/components/MiraCalBreadcrumbs";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useTenantId } from "../hook";

export default function Page() {
    const tenantId = useTenantId();
    const {isReady, allFloors} = useSeatOccupancy();

    return (
        <>
            <MiraCalBreadcrumbs>
                <Link href={`/${tenantId}`}>ホーム</Link>
                <Typography>座席</Typography>
            </MiraCalBreadcrumbs>
            <Box>
                <Toolbar variant="dense" sx={{ pt: 2 }}>
                    <Typography variant="h5" flexGrow={1}>座席</Typography>
                </Toolbar>
            </Box>
            {isReady && (
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                    {allFloors.map(floor => (
                        <Link key={floor.id} href={`/${tenantId}/floors/${floor.id}`}>
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
    );
}