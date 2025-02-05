"use client";

import Link from "next/link";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function Page() {
    return (
        <>
            <Typography variant="h5">システム管理者ページ</Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} pt={2}>
                <Link href="/sysAdmins/tenants">
                    <Card>
                        <CardContent>
                            <Typography variant="h6">テナント</Typography>
                            <Typography variant="caption">テナントの編集を行う</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">編集を行う</Button>
                        </CardActions>
                    </Card>
                </Link>
            </Box>
        </>
    );
}
