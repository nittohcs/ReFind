"use client";

import { queryKeys } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getUrl } from "aws-amplify/storage";

export function useStorageFileURL(filePath: string | null, expiresIn: number = 900) {
    return useQuery({
        queryKey: queryKeys.storage(filePath ?? ""),
        async queryFn() {
            if (!filePath) {
                return null;
            }
            const getUrlResult = await getUrl({
                path: filePath,
                options: {
                    validateObjectExistence: false,
                    expiresIn: expiresIn,
                    useAccelerateEndpoint: false,
                },
            });
            return getUrlResult.url.toString();
        },
        staleTime: expiresIn * 1000,    // ミリ秒なので1000倍する
    });
}
