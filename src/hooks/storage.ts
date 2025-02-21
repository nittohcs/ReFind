"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";
import { graphqlGetFileDownloadUrl, graphqlGetFileUploadUrl } from "@/services/graphql";
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
                if (!state || state.isInvalidated || Date.now() - state.dataUpdatedAt >= expiresIn * 1000) {
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

export async function uploadFile(filePath: string, file: File) {
    const fileTypeResult = await fileTypeFromBlob(file);
    const presignedUrl = await graphqlGetFileUploadUrl(filePath);
    return await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": fileTypeResult?.mime ?? "", // ファイルのMIMEタイプを指定
        },
    });
}
