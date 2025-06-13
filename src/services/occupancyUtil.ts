"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { funcCreateSeatOccupancyInput, FuncCreateSeatOccupancyMutation, FuncCreateSeatOccupancyMutationVariables, funcUpdateSeatOccupancyInput, FuncUpdateSeatOccupancyMutation, FuncUpdateSeatOccupancyMutationVariables, Seat, SeatOccupancy } from "@/API";
import { client } from "@/components/APIClientProvider";
import { funcCreateSeatOccupancy, funcUpdateSeatOccupancy } from "@/graphql/mutations";
import { getTodayYYYYMMDD } from "./util";

// 座席ごとの最新の座席確保状況のマップ(userIdが設定されているもののみを抽出)を返す
// キー: seatId
// 値: SeatOccupancy
export function getLatestOccupancyMap(data: SeatOccupancy[]) {
    const groupedOccupancies = Object.groupBy(data, x => x.seatId);
    const latestOccupancyMap = new Map<string, SeatOccupancy | null>(
        Object.entries(groupedOccupancies).map(([seatId, occupancies]) => {
            if (!occupancies || occupancies.length === 0) {
                return [seatId, null];
            }
            const latestOccupancy = occupancies.reduce((latest, current) => new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest);
            return [seatId, latestOccupancy];
        })
    );
    return new Map([...latestOccupancyMap].filter(([_, value]) => value !== null && value.userId) as [string, SeatOccupancy][]);
}

export async function occupySeat(seat: Seat, userId: string, userName: string) {
    return await occupySeatBySeatId(seat.tenantId, seat.id, userId, userName);
}

export async function occupySeatBySeatId(tenantId: string, seatId: string, userId: string, userName: string) {
    return await graphqlCreateSeatOccupancy({
        tenantId: tenantId,
        seatId: seatId,
        userId: userId,
        userName: userName,
        date: getTodayYYYYMMDD(),
        seatAvailability: true, // 座席取得
    });
}

export async function releaseSeat(seat: Seat) {
    return await releaseSeatBySeatId(seat.tenantId, seat.id);
}

// 登録ではなく更新したい。
export async function releaseSeatBySeatId(tenantId: string, seatId:
     string) {
    return await graphqlCreateSeatOccupancy({
        tenantId: tenantId,
        seatId: seatId,
        userId: null,
        userName: null,
        date: getTodayYYYYMMDD(),
        seatAvailability: false,// 座席解放
    });
}

export async function releaseSeatByOccupancy(occupancy: SeatOccupancy) {
    return await releaseSeatBySeatId(occupancy.tenantId, occupancy.seatId);
}

async function graphqlCreateSeatOccupancy(input: funcCreateSeatOccupancyInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcCreateSeatOccupancy,
            {
                input,
            } as FuncCreateSeatOccupancyMutationVariables
        )
    ) as GraphQLResult<FuncCreateSeatOccupancyMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcCreateSeatOccupancy) { throw new Error("createSeatOccupancyが失敗しました。"); }
    return result.data.funcCreateSeatOccupancy;
}

// 登録ではなく更新したい。
export async function updateSeat(seat: Seat) {
    return await releaseSeatBySeatIdUpdate(seat.tenantId, seat.id);
}

export async function releaseSeatBySeatIdUpdate(tenantId: string, seatId: string) {
   return await graphqlUpdateSeatOccupancy({
    id: "",
    userId:"",
    userName:"",
       tenantId: tenantId,
       seatId: seatId,
       date: getTodayYYYYMMDD(),
       seatAvailability: false,// 座席解放
   });
}

async function graphqlUpdateSeatOccupancy(input: funcUpdateSeatOccupancyInput) {
   const result = await client.graphql(
       graphqlOperation(
           funcUpdateSeatOccupancy,
           {
               input,
           } as FuncUpdateSeatOccupancyMutationVariables
       )
   ) as GraphQLResult<FuncUpdateSeatOccupancyMutation>;
   if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
   if (!result.data.funcUpdateSeatOccupancy) { throw new Error("updateSeatOccupancyが失敗しました。"); }
   return result.data.funcUpdateSeatOccupancy;
}