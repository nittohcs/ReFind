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
    // DBからデータを取得してキャッシュに保存する。
    const qOccupancies = useSeatOccupanciesByDateAndTenantId(today, tenantId);
    const qSeats = useSeatsByTenantId(tenantId);
    const qFloors = useFloorsByTenantId(tenantId);
    const authState = useAuthState();

    const isReady = qOccupancies.isFetched && qSeats.isFetched && qFloors.isFetched;
    const allSeats = useMemo(() => qSeats.data ?? [], [qSeats.data]);
    const allFloors = useMemo(() => qFloors.data ?? [], [qFloors.data]);
    //const seatOccupancyMap = useMemo(() => getLatestOccupancyMap(qOccupancies.data ?? []), [qOccupancies.data]);
    // seatOccupancyMapを監視する。
    // setSeatOccupancyMapが呼び出されるとseatOccupancyMapが更新される。
    const [seatOccupancyMap, setSeatOccupancyMap] = useState<Map<string, SeatOccupancy>>(new Map());
    useEffect(() => {
        if(qOccupancies.data){
            const latestMap = getLatestOccupancyMap(qOccupancies.data);
            setSeatOccupancyMap(latestMap);
        }
    }, [qOccupancies.data])

    // seatOccupancyMapの値を配列に変換して、キャッシュに保存する。
    // seatOccupancyMapが更新されるとキャッシュも更新する。
    const seatOccupancies = useMemo(() => Array.from(seatOccupancyMap.values()), [seatOccupancyMap]);

    // seatOccupanciesまたはログインユーザーが変わるとキャッシュを更新する。
    // 取得している座席の状態を保持する。
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

    // 取得している座席の情報をキャッシュで保存する。
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

    // 取得している座席のフロアの情報をキャッシュで保存する。
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
        // テナントの座席取得状況を再取得する。
        const { data } = await qOccupancies.refetch();
        // 再取得したデータから座席が取得されているデータのみ取得する。
        const latestMap = getLatestOccupancyMap(data ?? []);
        // occupansiesMapに反映する。
        setSeatOccupancyMap(latestMap);
        // 呼び出し元に返す。
        // setSeatOccupancyMapで更新されるタイミングがレンダリング後？のため、最新のデータを渡す。
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
        refetchOccupancies: refetchSeatoccupancies,
    };
};
