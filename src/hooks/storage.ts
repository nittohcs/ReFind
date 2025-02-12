"use client";

//import { getUrl } from "aws-amplify/storage";
import { GraphQLResult, graphqlOperation } from "@aws-amplify/api-graphql";
import { useQuery } from "@tanstack/react-query";
import { GetFileDownloadUrlQuery, GetFileDownloadUrlQueryVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { getFileDownloadUrl } from "@/graphql/queries";
import { queryKeys } from "@/services/queryKeys";

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

async function graphqlGetFileDownloadUrl(filePath: string, expiresIn: number) {
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
