"use client";

import { useCallback } from "react";
import { GraphQLResult, graphqlOperation } from "@aws-amplify/api-graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetFileDownloadUrlQuery, GetFileDownloadUrlQueryVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { getFileDownloadUrl } from "@/graphql/queries";
import { queryKeys } from "@/services/queryKeys";
import { useEnqueueSnackbar } from "./ui";

export function useStorageFileURL(filePath: string | null, expiresIn: number = 900) {
    return useQuery({
        queryKey: queryKeys.storage(filePath ?? ""),
        async queryFn() {
            if (!filePath) {
                return null;
            }
            const url = await graphqlGetFileDownloadUrl(filePath, expiresIn);
            return url;
        },
        staleTime: expiresIn * 1000,    // ミリ秒なので1000倍する
    });
}

export async function graphqlGetFileDownloadUrl(filePath: string, expiresIn: number) {
    const result = await client.graphql(
        graphqlOperation(
            getFileDownloadUrl,
            {
                filePath,
                expiresIn,
            } as GetFileDownloadUrlQueryVariables
        )
    ) as GraphQLResult<GetFileDownloadUrlQuery>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.getFileDownloadUrl) { throw new Error("ダウンロードURLの取得に失敗しました。"); }
    return result.data.getFileDownloadUrl;
}

export function useDownloadStorageFile(expiresIn: number = 900) {
    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const download = useCallback(async (filePath?: string | null) => {
        if (!filePath) {
            return;
        }

        try {
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
    }, [queryClient, enqueueSnackbar, expiresIn]);
    return download;
}
