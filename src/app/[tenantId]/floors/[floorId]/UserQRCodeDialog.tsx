"use client";

import { FC, useCallback } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Seat, SeatOccupancy } from "@/API";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { getLatestOccupancyMap, occupySeat, releaseSeat, updateSeat } from "@/services/occupancyUtil";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "../../hook";
import QRCodeReader from "@/components/QRCodeReader";
import { useRouter } from "next/navigation";
import { useSeatOccupancy } from "@/hooks/seatOccupancy";
import { useAuthState } from "@/hooks/auth";
import { useSeatOccupanciesByDateAndTenantId, useUsersByTenantId } from "@/services/graphql";

export type UserQRCodeDialogData = {
    title: string,
    message: string,
    newSeat: Seat | null,
    oldSeat: Seat | null,
    userId: string,
    userName: string,
};

type UserQRCodeDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: UserQRCodeDialogData | null,
};

export const UserQRCodeDialog: FC<UserQRCodeDialogProps> = ({
    isOpened,
    close,
    data: dialogData,
}) => {
    const tenantId = useTenantId();
    const today = useTodayYYYYMMDD();

    const authState = useAuthState();
    const { isReady, myOccupancy, mySeat, myFloor, allSeats, seatOccupancyMap, allFloors } = useSeatOccupancy();    
    const router = useRouter();
    const qUsers = useUsersByTenantId(tenantId);
    const qOccupancies = useSeatOccupanciesByDateAndTenantId(today, tenantId);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();

    // QRコード読み取り処理
    const onRead = useCallback(async (userId: string)=> {

        // ユーザー存在チェック 
        const user = qUsers.data?.find(x => x.id === userId) ?? null;
        if(!user){
            enqueueSnackbar(`無効なQRコード(ユーザー)が読み込まれました。`, { variant: "error" });
            //router.push(`/${tenantId}`);
            // ダイアログを閉じる
            close();
            return true;
        }else{
            enqueueSnackbar(`ユーザー読み取りました。`, { variant: "success" });
        }

        if (!dialogData) {
            throw new Error("ダイアログのデータが設定されていません。");
            // ダイアログを閉じる
            close();
        }
        // 座席の存在チェック
        const seat = allSeats.find(x => x.id === dialogData?.newSeat?.id) ?? null;
        if (!seat) {
            enqueueSnackbar(`無効なQRコードが読み込まれました。`, { variant: "error" });
            //router.push(`/${tenantId}`);
            // ダイアログを閉じる
            close();
            return true;
        }
        // フロアの存在チェック
        const floor = allFloors.find(x => x.id === seat.floorId) ?? null;
        if (!floor) {
            enqueueSnackbar(`座席「${seat.name}」に対応するフロアが存在しません。`, { variant: "error" });
            router.push(`/${tenantId}`);
            // ダイアログを閉じる
            close();
            return true;
        }

        // 座席ごとの最新の座席確保状況のマップ
        const seatOccupancyMap = getLatestOccupancyMap(qOccupancies.data ?? []);

        // ユーザーごとの座席確保状況のマップ
        const userOccupancyMap = new Map(Array.from(seatOccupancyMap.values()).filter(x => x.userId).map(x => [x.userId as string, x]));
        // 読み取ったユーザーIDで絞り込む
        const readUserOccupancy = userOccupancyMap.get(userId) ?? null;        
        // myseatはuserIDを用いて取得する必要があるかも
        const oldSeat = allSeats.find(x => x.id === readUserOccupancy?.seatId) ?? null;
        const oldFloor = allFloors.find(x => x.id === oldSeat?.floorId) ?? null;

        // 座席を取得する部分
        const occupancies: SeatOccupancy[] = [];
        
        if (oldSeat) {
            // 座席を移動する場合
            occupancies.push(await releaseSeat(oldSeat));
            //occupancies.push(await updateSeat(oldSeat));
            occupancies.push(await occupySeat(seat, user.id ?? "", user.name ?? ""));
            enqueueSnackbar(`フロア「${oldFloor?.name}」の座席「${oldSeat?.name}」を解放し、フロア「${floor.name}」の座席「${seat.name}」を確保しました。`, { variant: "success" });
        } else {
            // 座席を取得する場合
            occupancies.push(await occupySeat(seat, user.id ?? "", user.name ?? ""));
            enqueueSnackbar(`フロア「${floor.name}」の座席「${seat.name}」を確保しました。`, { variant: "success" });
        }
        queryClient.setQueryData<SeatOccupancy[]>(queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId), items => {
            if (!items) {
                return items;
            }
            return [...items, ...occupancies];
        });
        router.push(`/${tenantId}/floors/${floor.id}`);

        // ダイアログを閉じる
        close();

        return true;
    }, [allSeats, authState.name, authState.username, enqueueSnackbar, myOccupancy, mySeat, router, seatOccupancyMap, queryClient, today, allFloors, myFloor, tenantId, dialogData]);
    
    // onReadの後に連続でmutationを呼び出す
    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => close()}>
            <DialogTitle>{dialogData?.title}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DialogContentText>{dialogData?.message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>

                <Box pt={2}>
                    {isReady && (
                        <QRCodeReader onRead={onRead}/>
                    )}                    
                </Box>

                <Button
                    variant="contained"
                    onClick={close}
                >
                    ×
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default UserQRCodeDialog;
