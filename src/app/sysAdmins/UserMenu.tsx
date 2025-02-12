"use client";

import Link from "next/link";
import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { signOut } from "aws-amplify/auth";
import { useAuthState } from "@/hooks/auth";
import { useMenu } from "@/hooks/ui";

export function UserMenu() {
    const menu = useMenu();
    const authState = useAuthState();

    return (
        <Box>
            <IconButton size="large" onClick={menu.openHandler} color="inherit">
                <AccountCircle />
            </IconButton>
            <Menu open={menu.isOpened} anchorEl={menu.anchorEl} onClose={menu.closeHandler}>
                {!!authState.name && (
                    <Box width={200}>
                        <Box px={2} py={1}>
                            <Typography variant="caption">ユーザー</Typography>
                            <Typography variant="body1">{authState.name}</Typography>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                    </Box>
                )}
                <Link href="/userSettings">
                    <MenuItem onClick={menu.closeHandler}>設定</MenuItem>
                </Link>
                <MenuItem onClick={() => signOut()}>ログアウト</MenuItem>
            </Menu>
        </Box>
    );
}
export default UserMenu;
