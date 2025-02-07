"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { DeleteFileMutation, DeleteFileMutationVariables, DeleteFloorInput, DeleteFloorMutation, DeleteFloorMutationVariables, funcCreateFloorInput, FuncCreateFloorMutation, FuncCreateFloorMutationVariables, funcDeleteFloorInput, FuncDeleteFloorMutation, FuncDeleteFloorMutationVariables, funcUpdateFloorInput, FuncUpdateFloorMutation, FuncUpdateFloorMutationVariables, GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { deleteFile, deleteFloor, funcCreateFloor, funcDeleteFloor, funcUpdateFloor } from "@/graphql/mutations";
import { getFileUploadUrl } from "@/graphql/queries";

export async function graphqlUpdateFloor(input: funcUpdateFloorInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcUpdateFloor,
            {
                input,
            } as FuncUpdateFloorMutationVariables
        )
    ) as GraphQLResult<FuncUpdateFloorMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcUpdateFloor) { throw new Error("フロアの更新に失敗しました"); }
    return result.data.funcUpdateFloor;
}

export async function graphqlCreateFloor(input: funcCreateFloorInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcCreateFloor,
            {
                input,
            } as FuncCreateFloorMutationVariables
        )
    ) as GraphQLResult<FuncCreateFloorMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcCreateFloor) { throw new Error("フロアの登録に失敗しました。"); }
    return result.data.funcCreateFloor;
}

export async function graphqlDeleteFloor(input: funcDeleteFloorInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcDeleteFloor,
            {
                input,
            } as FuncDeleteFloorMutationVariables
        )
    ) as GraphQLResult<FuncDeleteFloorMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcDeleteFloor) { throw new Error("フロアの削除に失敗しました。"); }
    return result.data.funcDeleteFloor;
}

export async function graphqlGetFileUploadUrl(filePath: string) {
    const result = await client.graphql(
        graphqlOperation(
            getFileUploadUrl,
            {
                filePath,
            } as GetFileUploadUrlQueryVariables
        )
    ) as GraphQLResult<GetFileUploadUrlQuery>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.getFileUploadUrl) { throw new Error("ファイルアップロード用URLの取得に失敗しました。"); }
    return result.data.getFileUploadUrl;
}

export async function graphqlDeleteFile(filePath: string) {
    const result = await client.graphql(
        graphqlOperation(
            deleteFile,
            {
                filePath,
            } as DeleteFileMutationVariables
        )
    ) as GraphQLResult<DeleteFileMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.deleteFile) { throw new Error("ファイルの削除に失敗しました。"); }
    return result.data.deleteFile;
}
