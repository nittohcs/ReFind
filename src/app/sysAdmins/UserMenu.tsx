"use client";

import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { signOut } from "aws-amplify/auth";
import { useAuthState } from "@/hooks/auth";
import { useDownloadStorageFile } from "@/hooks/storage";
import { useMenu } from "@/hooks/ui";
import { sysAdminManualPath } from "@/services/manual";

export function UserMenu() {
    const menu = useMenu();
    const authState = useAuthState();
    const download = useDownloadStorageFile();

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
                <MenuItem onClick={menu.withClose(async () => await download(sysAdminManualPath))}>ヘルプ</MenuItem>
                <MenuItem onClick={() => signOut()}>ログアウト</MenuItem>
                <Divider sx={{ mb: 1 }} />
                {/* 利用規約 */}
                {authState.groups?.admins && (
                    <MenuItem onClick={menu.withClose(async () => await download(sysAdminManualPath))}>利用規約</MenuItem>
                )}
                <Box px={2} py={1}>
                    <Typography variant="body1">ver 1.0.0</Typography>
                </Box>
            </Menu>
        </Box>
    );
}
export default UserMenu;
