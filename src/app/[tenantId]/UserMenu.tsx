"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { signOut } from "aws-amplify/auth";
import { Seat } from "@/API";
import { useAuthState } from "@/hooks/auth";
import { useConfirmDialogState } from "@/hooks/confirmDialogState";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { checkImageExists, useDownloadStorageFile, useStorageFileURL } from "@/hooks/storage";
import { useMenu } from "@/hooks/ui";
import { adminManualPath, userManualPath } from "@/services/manual";
import { useTenantId } from "./hook";
import ReleaseSeatDialog from "./ReleaseSeatDialog";

export function UserMenu() {
    const tenantId = useTenantId();
    const menu = useMenu();
    const authState = useAuthState();
    const { isReady, mySeat, myFloor } = useSeatOccupancy();
    const confirmDialogState = useConfirmDialogState<Seat>();
    const download = useDownloadStorageFile();
    const [isExistUserIcon, setIsExitUserIcon] = useState(false);
    const qUserIcon = useStorageFileURL(`public/${authState.tenantId}/users/${authState.username}`);
    useEffect(() => {
        const checkImage = async () => {
            if (qUserIcon.isFetched) {
                const isExist = await checkImageExists(qUserIcon.data ?? "");
                setIsExitUserIcon(isExist);
            }
        };
        checkImage();
    }, [qUserIcon]);

    return (
        <Box>
            <IconButton size="large" onClick={menu.openHandler} color="inherit">
                {isExistUserIcon ? (
                    <Image src={qUserIcon.data!} alt="" width={24} height={24} />
                ) : (
                    <AccountCircle style={{ color: isReady && mySeat ? "rgba(0, 192, 0, 1)" : "gray" }}/>
                )}
            </IconButton>
            <Menu open={menu.isOpened} anchorEl={menu.anchorEl} onClose={menu.closeHandler}>
                {!!authState.name && (
                    <Box width={200}>
                        <Box px={2} py={1}>
                            <Typography variant="caption">ユーザー</Typography>
                            <Typography variant="body1">{authState.name}</Typography>
                        </Box>
                        {isReady && mySeat && myFloor && (
                            <Box px={2} py={1}>
                                <Typography variant="caption">フロア</Typography>
                                <Typography variant="body1">{myFloor.name}</Typography>
                                <Typography variant="caption">座席</Typography>
                                <Typography variant="body1">{mySeat?.name}</Typography>
                            </Box>
                        )}
                        <Divider sx={{ mb: 1 }} />
                    </Box>
                )}
                {isReady && mySeat && myFloor && (
                    <MenuItem onClick={menu.withClose(() => confirmDialogState.open("座席解放", `フロア「${myFloor.name}」の座席「${mySeat.name}」を解放します。`, mySeat))}>座席解放</MenuItem>
                )}
                <Link href={`/${tenantId}/userSettings`}>
                    <MenuItem onClick={menu.closeHandler}>設定</MenuItem>
                </Link>
                <MenuItem onClick={menu.withClose(async () => await download(userManualPath))}>ユーザーマニュアル</MenuItem>
                {authState.groups?.admins && (
                    <MenuItem onClick={menu.withClose(async () => await download(adminManualPath))}>管理者マニュアル</MenuItem>
                )}
                <MenuItem onClick={() => signOut()}>ログアウト</MenuItem>
            </Menu>
            <ReleaseSeatDialog {...confirmDialogState} />
        </Box>
    );
}
export default UserMenu;
