"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Floor, Seat, SeatOccupancy } from "@/API";
import { useFloorsByTenantId, useSeatOccupanciesByDateAndTenantId, useSeatsByTenantId } from "@/services/graphql";
import { getLatestOccupancyMap } from "@/services/occupancyUtil";
import { useAuthState } from "./auth";
import { useTodayYYYYMMDD } from "./util";

type UseSeatOccupancyValue = {
    isReady: boolean,
    myOccupancy: SeatOccupancy | null,
    mySeat: Seat | null,
    myFloor: Floor | null,
    allSeats: Seat[],
    allFloors: Floor[],
    seatOccupancyMap: Map<string, SeatOccupancy>,    
    refetchOccupancies: () => Promise<Map<string, SeatOccupancy>>, // 座席情報最新化

};
const defaultValue: UseSeatOccupancyValue = {
    isReady: false,
    myOccupancy: null,
    mySeat: null,
    myFloor: null,
    allSeats: [],
    allFloors: [],
    seatOccupancyMap: new Map<string, SeatOccupancy>(),
    refetchOccupancies: async () => new Map<string, SeatOccupancy>(),
};
export const SeatOccupancyContext = createContext<UseSeatOccupancyValue>(defaultValue);
export const useSeatOccupancy = () => useContext(SeatOccupancyContext);

export const useSeatOccupancyValue = (tenantId: string): UseSeatOccupancyValue => {
    const today = useTodayYYYYMMDD();
    const qOccupancies = useSeatOccupanciesByDateAndTenantId(today, tenantId);
    const qSeats = useSeatsByTenantId(tenantId);
    const qFloors = useFloorsByTenantId(tenantId);
    const authState = useAuthState();

    const isReady = qOccupancies.isFetched && qSeats.isFetched && qFloors.isFetched;
    const allSeats = useMemo(() => qSeats.data ?? [], [qSeats.data]);
    const allFloors = useMemo(() => qFloors.data ?? [], [qFloors.data]);
    //const seatOccupancyMap = useMemo(() => getLatestOccupancyMap(qOccupancies.data ?? []), [qOccupancies.data]);
    const [seatOccupancyMap, setSeatOccupancyMap] = useState<Map<string, SeatOccupancy>>(new Map());
    useEffect(() => {
        if(qOccupancies.data){
            const latestMap = getLatestOccupancyMap(qOccupancies.data);
            setSeatOccupancyMap(latestMap);
        }
    }, [qOccupancies.data])

    const seatOccupancies = useMemo(() => Array.from(seatOccupancyMap.values()), [seatOccupancyMap]);
    const myOccupancy = useMemo(() => {
        if (!isReady) {
            return null;
        }

        const filtered = seatOccupancies.filter(x => x.userId === authState.username);
        if (filtered.length === 0) {
            return null;
        }
        // 最新データを取得(filteredには1要素しか含まれないはずだが一応)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return filtered[0];
    }, [isReady, seatOccupancies, authState.username]);
    const mySeat = useMemo(() => {
        if (!isReady) {
            return null;
        }

        const seatId = myOccupancy?.seatId;
        if (!seatId) {
            return null;
        }
        return allSeats.find(x => x.id === seatId) ?? null;
    }, [isReady, myOccupancy, allSeats]);
    const myFloor = useMemo(() => {
        if (!isReady) {
            return null;
        }

        const floorId = mySeat?.floorId;
        if (!floorId) {
            return null;
        }
        return allFloors.find(x => x.id === floorId) ?? null;
    }, [isReady, mySeat, allFloors]);

    async function refetchSeatoccupancies(): Promise<Map<string, SeatOccupancy>> {        
        //await qOccupancies.refetch();
        const { data } = await qOccupancies.refetch();
        const latestMap = getLatestOccupancyMap(data ?? []);
        setSeatOccupancyMap(latestMap);
        return latestMap;
    }

    return {
        isReady,
        myOccupancy,
        mySeat,
        myFloor,
        allSeats,
        allFloors,
        seatOccupancyMap,
        refetchOccupancies: refetchSeatoccupancies, // ← 追加
    };
};
