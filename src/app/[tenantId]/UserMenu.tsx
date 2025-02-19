"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { signOut } from "aws-amplify/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Seat } from "@/API";
import { useAuthState } from "@/hooks/auth";
import { useConfirmDialogState } from "@/hooks/confirmDialogState";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { graphqlGetFileDownloadUrl } from "@/hooks/storage";
import { useEnqueueSnackbar, useMenu } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { adminManualPath, userManualPath } from "@/services/manual";
import { useTenantId } from "./hook";
import ReleaseSeatDialog from "./ReleaseSeatDialog";

export function UserMenu() {
    const tenantId = useTenantId();
    const menu = useMenu();
    const authState = useAuthState();
    const { isReady, mySeat, myFloor } = useSeatOccupancy();
    const confirmDialogState = useConfirmDialogState<Seat>();

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const downloadManual = useCallback(async (filePath: string) => {
        try {
            const expiresIn = 900;
            let storageUrl = queryClient.getQueryData<string>(queryKeys.storage(filePath)) ?? "";
            if (storageUrl) {
                const state = queryClient.getQueryState<string>(queryKeys.storage(filePath));
                if (!state || Date.now() - state.dataUpdatedAt >= expiresIn * 1000) {
                    storageUrl = "";
                }
            }

            if (!storageUrl) {
                storageUrl = await graphqlGetFileDownloadUrl(filePath, expiresIn);
                if (!storageUrl) {
                    throw new Error("ダウンロードURLの取得に失敗しました。");
                }
                queryClient.setQueryData(queryKeys.storage(filePath), (_data: string) => storageUrl);
            }

            window.open(storageUrl, "_blank", "noopener,noreferrer");
        } catch (err) {
            console.log(err);
            enqueueSnackbar("ダウンロードに失敗しました。", { variant: "error" });
        }
    }, [queryClient, enqueueSnackbar]);

    return (
        <Box>
            <IconButton size="large" onClick={menu.openHandler} color="inherit">
                <AccountCircle style={{ color: isReady && mySeat ? "rgba(0, 192, 0, 1)" : "gray" }}/>
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
                <MenuItem onClick={menu.withClose(async () => await downloadManual(userManualPath))}>ユーザーマニュアル</MenuItem>
                {authState.groups?.admins && (
                    <MenuItem onClick={menu.withClose(async () => await downloadManual(adminManualPath))}>管理者マニュアル</MenuItem>
                )}
                <MenuItem onClick={() => signOut()}>ログアウト</MenuItem>
            </Menu>
            <ReleaseSeatDialog {...confirmDialogState} />
        </Box>
    );
}
export default UserMenu;
