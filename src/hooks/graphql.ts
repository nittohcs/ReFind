"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { client } from "@/components/APIClientProvider";
import { onCreateSeatOccupancy } from "@/graphql/subscriptions";
import { queryKeys } from "@/services/queryKeys";
import { useTodayYYYYMMDD } from "./util";

export const useAutoReloadSeatOccupancies = () => {
    const queryClient = useQueryClient();
    const today = useTodayYYYYMMDD();
    // 他の人が座席を確保したときにデータを再取得して最新の情報が使用されるようにする
    useEffect(() => {
        const subscription = client.graphql({
            query: onCreateSeatOccupancy
        }).subscribe({
            next: (_x) => {
                // SeatOccupancy取得クエリを無効化して再取得されるようにする
                queryClient.invalidateQueries({ queryKey: queryKeys.graphqlSeatOccupanciesByDate(today) });
            },
            error: (error) => console.warn(error),
        })

        return () => {
            subscription.unsubscribe();
        };
    }, [queryClient, today]);
};
