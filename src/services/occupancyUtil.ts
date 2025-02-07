"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { CreateSeatOccupancyInput, CreateSeatOccupancyMutation, CreateSeatOccupancyMutationVariables, Seat, SeatOccupancy } from "@/API";
import { client } from "@/components/APIClientProvider";
import { createSeatOccupancy } from "@/graphql/mutations";
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
    return await occupySeatBySeatId(seat.id, userId, userName);
}

export async function occupySeatBySeatId(seatId: string, userId: string, userName: string) {
    // TODO 実装
    // return await graphqlCreateSeatOccupancy({
    //     seatId: seatId,
    //     userId: userId,
    //     userName: userName,
    //     date: getTodayYYYYMMDD(),
    // });
}

export async function releaseSeat(seat: Seat) {
    return await releaseSeatBySeatId(seat.id);
}

export async function releaseSeatBySeatId(seatId: string) {
    // TODO 実装
    // return await graphqlCreateSeatOccupancy({
    //     seatId: seatId,
    //     userId: null,
    //     userName: null,
    //     date: getTodayYYYYMMDD(),
    // });
}

export async function releaseSeatByOccupancy(occupancy: SeatOccupancy) {
    return await releaseSeatBySeatId(occupancy.seatId);
}

async function graphqlCreateSeatOccupancy(input: CreateSeatOccupancyInput) {
    const result = await client.graphql(
        graphqlOperation(
            createSeatOccupancy,
            {
                input,
            } as CreateSeatOccupancyMutationVariables
        )
    ) as GraphQLResult<CreateSeatOccupancyMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.createSeatOccupancy) { throw new Error("createSeatOccupancyが失敗しました。"); }
    return result.data.createSeatOccupancy;
}
