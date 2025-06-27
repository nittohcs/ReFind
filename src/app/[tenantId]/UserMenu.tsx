"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, colors, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckCircle from "@mui/icons-material/CheckCircleTwoTone";
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
            <IconButton size="large" onClick={menu.openHandler} color="inherit" sx={{width: '50px', height: '50px'}}>
                {isExistUserIcon ? (
                    <div>
                    <Image src={qUserIcon.data!} alt="" width={30} height={30} 
                        style={{
                            position: "relative",
                            marginTop: "10px"
                        }}/>
                    <CheckCircle fontSize="small"
                        style={{ 
                            display: isReady && mySeat ? "" : "none",
                            color: "rgba(0, 192, 0, 1)",
                            position: "absolute",
                            top: "60%", left: "60%",
                        }}/>
                    </div>
                ) : (
                    <AccountCircle style={{ color: isReady && mySeat ? "rgba(0, 192, 0, 1)" : "gray" }}/>
                )}
            </IconButton>
            <Menu open={menu.isOpened} anchorEl={menu.anchorEl} onClose={menu.closeHandler}>
                {!!authState.name && (
                    <Box width={200}>
                        <Box px={2} py={1}>
                            <Typography variant="caption" color="rgb(104, 104, 104)">ユーザー</Typography>
                            <Typography variant="body1" color="rgb(104, 104, 104)">{authState.name}</Typography>
                        </Box>
                        {/* 販売に向けて削除 */}
                        {/* {isReady && mySeat && myFloor && (
                            <Box px={2} py={1}>
                                <Typography variant="caption">フロア</Typography>
                                <Typography variant="body1">{myFloor.name}</Typography>
                                <Typography variant="caption">座席</Typography>
                                <Typography variant="body1">{mySeat?.name}</Typography>
                            </Box>
                        )} */}
                        <Divider sx={{ mb: 1 }} />
                    </Box>
                )}
                {isReady && mySeat && myFloor && (
                    <MenuItem onClick={menu.withClose(() => confirmDialogState.open("座席解放", `フロア「${myFloor.name}」の座席「${mySeat.name}」を解放します。`, mySeat))}>座席解放</MenuItem>
                )}                                
                {isReady && mySeat && myFloor && (
                    <Divider sx={{ mb: 1 }} />
                )}
                
                {/* 設定 */}
                <Link href={`/${tenantId}/userSettings`}>
                    <MenuItem onClick={menu.closeHandler} sx={{ mb: 1 }}>設定</MenuItem>
                </Link>               
                <Divider sx={{ mb: 1 }} />
                
                {/* ログアウト */}
                <MenuItem onClick={() => signOut()}>ログアウト</MenuItem>   
                <Divider sx={{ mb: 1 }} />

                {/* 一般ユーザー様ヘルプ */}
                {authState.groups?.users && (
                    <MenuItem onClick={menu.withClose(async () => await download(userManualPath))}>ヘルプ</MenuItem>
                )}
                {/* 管理者用ヘルプ */}
                {authState.groups?.admins && (
                    <MenuItem onClick={menu.withClose(async () => await download(adminManualPath))}>ヘルプ</MenuItem>
                )}
                {/* 管理者用ヘルプ */}
                {authState.groups?.admins && (
                    <MenuItem onClick={menu.withClose(async () => await download(adminManualPath))}>利用規約</MenuItem>
                )}
                <Box px={2} py={1}>
                    <Typography variant="body1" color="rgb(104, 104, 104)" >ver 1.0.0</Typography>
                </Box>
            </Menu>
            <ReleaseSeatDialog {...confirmDialogState} />
        </Box>
    );
}
export default UserMenu;
