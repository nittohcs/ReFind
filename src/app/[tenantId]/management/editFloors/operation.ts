"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { DeleteFloorInput, DeleteFloorMutation, DeleteFloorMutationVariables, funcCreateFloorInput, FuncCreateFloorMutation, FuncCreateFloorMutationVariables, funcUpdateFloorInput, FuncUpdateFloorMutation, FuncUpdateFloorMutationVariables, GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { deleteFloor, funcCreateFloor, funcUpdateFloor } from "@/graphql/mutations";
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

export async function graphqlDeleteFloor(input: DeleteFloorInput) {
    const result = await client.graphql(
        graphqlOperation(
            deleteFloor,
            {
                input,
            } as DeleteFloorMutationVariables
        )
    ) as GraphQLResult<DeleteFloorMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.deleteFloor) { throw new Error("フロアの削除に失敗しました。"); }
    return result.data.deleteFloor;
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
