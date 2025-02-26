"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SeatOccupancy } from "@/API";
import { client } from "@/components/APIClientProvider";
import { onCreateSeatOccupancyByTenantId } from "@/graphql/subscriptions";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { queryKeys } from "@/services/queryKeys";
import { useTenantId } from "./hook";

export const AutoReloadSeatOccupancies: FC<PropsWithChildren> = ({ children }) => {
    const tenantId = useTenantId();
    const queryClient = useQueryClient();
    const today = useTodayYYYYMMDD();
    // 他の人が座席を確保したときにデータを取得して最新の情報が使用されるようにする
    useEffect(() => {
        const subscription = client.graphql({
            query: onCreateSeatOccupancyByTenantId,
            variables: {
                tenantId,
            }
        }).subscribe({
            next: (value) => {
                // クエリのキャッシュを更新する
                queryClient.setQueryData<SeatOccupancy[]>(queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId), items => {
                    if (!items) {
                        return items;
                    }
                    // 既にキャッシュに追加されているデータは追加しない
                    if (items.some(item => item.id === value.data.onCreateSeatOccupancyByTenantId.id)) {
                        return items;
                    }
                    return [...items, value.data.onCreateSeatOccupancyByTenantId];
                });
            },
            error: (error) => console.warn(error),
        })

        return () => {
            subscription.unsubscribe();
        };
    }, [tenantId, queryClient, today]);
    
    return (
        <>
            {children}
        </>
    );
};
export default AutoReloadSeatOccupancies;
