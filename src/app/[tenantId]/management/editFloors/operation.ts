"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { CreateFloorInput, CreateFloorMutation, CreateFloorMutationVariables, DeleteFloorInput, DeleteFloorMutation, DeleteFloorMutationVariables, UpdateFloorInput, UpdateFloorMutation, UpdateFloorMutationVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { createFloor, deleteFloor, updateFloor } from "@/graphql/mutations";

export async function graphqlUpdateFloor(input: UpdateFloorInput) {
    const result = await client.graphql(
        graphqlOperation(
            updateFloor,
            {
                input,
            } as UpdateFloorMutationVariables
        )
    ) as GraphQLResult<UpdateFloorMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.updateFloor) { throw new Error("フロアの更新に失敗しました"); }
    return result.data.updateFloor;
}

export async function graphqlCreateFloor(input: CreateFloorInput) {
    const result = await client.graphql(
        graphqlOperation(
            createFloor,
            {
                input,
            } as CreateFloorMutationVariables
        )
    ) as GraphQLResult<CreateFloorMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.createFloor) { throw new Error("フロアの登録に失敗しました。"); }
    return result.data.createFloor;
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
