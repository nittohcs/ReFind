"use client";

import { createContext, useContext, useMemo } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { Floor, Seat, SeatOccupancy } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { useListAllUsers, useListAllUsersInGroup } from "@/services/AdminQueries";
//import { useListAllFloors, useListAllSeats, useListSeatOccupanciesByDate } from "@/services/graphql";
import { getLatestOccupancyMap } from "@/services/occupancyUtil";
import { AdminQueriesUser, ReFindUser } from "@/types/user";
import { useFloorsByTenantId, useSeatOccupanciesByDateAndTenantId, useSeatsByTenantId } from "@/services/graphql";

type UseReFindUsersResult = {
    data: ReFindUser[],
    queryFloors: UseQueryResult<Floor[], Error>,
    querySeats: UseQueryResult<Seat[], Error>,
    queryOccupancies: UseQueryResult<SeatOccupancy[], Error>,
    isLoading: boolean,
    isFetched: boolean,
    isFetching: boolean,
    refetch: () => void,
};

function ToReFindUser(user: AdminQueriesUser): ReFindUser {
    return {
        ...user,
        isAdmin: false,
        seatId: "",
        seatName: "",
        floorId: "",
        floorName: "",
    };
}

export function useReFindUsersValue() {
    const tenantId = useTenantId();
    const todayYYYYMMDD = useTodayYYYYMMDD();
    const qUsers = useListAllUsers();
    const qAdmins = useListAllUsersInGroup("admins");
    const qFloors = useFloorsByTenantId(tenantId);
    const qSeats = useSeatsByTenantId(tenantId);
    const qOccupancies = useSeatOccupanciesByDateAndTenantId(todayYYYYMMDD, tenantId);

    const ret = useMemo(() => {
        const isLoading = qUsers.isLoading || qAdmins.isLoading || qFloors.isLoading || qSeats.isLoading || qOccupancies.isLoading;
        const isFetched = qUsers.isFetched && qAdmins.isFetched && qFloors.isFetched && qSeats.isFetched && qOccupancies.isFetched;
        const isFetching = qUsers.isFetching || qAdmins.isFetching || qFloors.isFetching || qSeats.isFetching || qOccupancies.isFetching;

        let data: ReFindUser[] = [];
        if (isFetched) {
            // ユーザーidとユーザーのマップ
            const m = new Map<string, ReFindUser>((qUsers.data ?? []).map(x => [x.id, ToReFindUser(x)]));

            // qAdminsに入っているユーザーは管理者
            for (const admin of (qAdmins.data ?? [])) {
                const user = m.get(admin.id);
                if (user) {
                    user.isAdmin = true;
                }
            }
            
            // 座席ごとの最新の座席確保状況のマップ
            const seatOccupancyMap = getLatestOccupancyMap(qOccupancies.data ?? []);

            // ユーザーごとの座席確保状況のマップ
            const userOccupancyMap = new Map(Array.from(seatOccupancyMap.values()).filter(x => x.userId).map(x => [x.userId as string, x]));

            const seatMap = new Map((qSeats.data ?? []).map(x => [x.id, x]));
            const floorMap = new Map((qFloors.data ?? []).map(x => [x.id, x]));
            
            for (const user of m.values()) {
                const occupancy = userOccupancyMap.get(user.id);
                if (occupancy) {
                    const seat = seatMap.get(occupancy.seatId);
                    if (seat) {
                        user.seatId = seat.id;
                        user.seatName = seat.name;

                        const floor = floorMap.get(seat.floorId);
                        if (floor) {
                            user.floorId = floor.id;
                            user.floorName = floor.name;
                        }
                    }
                }
            }

            data = Array.from(m.values());
        }

        return {
            data,
            queryFloors: qFloors,
            querySeats: qSeats,
            queryOccupancies: qOccupancies,
            isLoading,
            isFetched,
            isFetching,
            refetch: () => {
                qUsers.refetch();
                qAdmins.refetch();
                qFloors.refetch();
                qSeats.refetch();
                qOccupancies.refetch();
            }
        };
    }, [qUsers, qAdmins, qFloors, qSeats, qOccupancies]);
    return ret;
}

const defaultValue: UseReFindUsersResult = {
    data: [],
    queryFloors: {} as UseQueryResult<Floor[], Error>,
    querySeats: {} as UseQueryResult<Seat[], Error>,
    queryOccupancies: {} as UseQueryResult<SeatOccupancy[], Error>,
    isLoading: true,
    isFetched: false,
    isFetching: true,
    refetch: () => {},
};
export const ReFindUsersContext = createContext(defaultValue);
export const useReFindUsers = () => useContext(ReFindUsersContext);
