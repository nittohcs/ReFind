"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { DeleteSeatInput, DeleteSeatMutation, DeleteSeatMutationVariables, funcCreateSeatInput, FuncCreateSeatMutation, FuncCreateSeatMutationVariables, UpdateSeatInput, UpdateSeatMutation, UpdateSeatMutationVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { deleteSeat, funcCreateSeat, updateSeat } from "@/graphql/mutations";

export async function graphqlCreateSeat(input: funcCreateSeatInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcCreateSeat,
            {
                input,
            } as FuncCreateSeatMutationVariables
        )
    ) as GraphQLResult<FuncCreateSeatMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcCreateSeat) { throw new Error("座席の登録に失敗しました。"); }
    return result.data.funcCreateSeat;
}

export async function graphqlUpdateSeat(input: UpdateSeatInput) {
    const result = await client.graphql(
        graphqlOperation(
            updateSeat,
            {
                input,
            } as UpdateSeatMutationVariables
        )
    ) as GraphQLResult<UpdateSeatMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.updateSeat) { throw new Error("座席の更新に失敗しました。"); }
    return result.data.updateSeat;
}

export async function graphqlDeleteSeat(input: DeleteSeatInput) {
    const result = await client.graphql(
        graphqlOperation(
            deleteSeat,
            {
                input,
            } as DeleteSeatMutationVariables
        )
    ) as GraphQLResult<DeleteSeatMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.deleteSeat) { throw new Error("座席の削除に失敗しました。"); }
    return result.data.deleteSeat;
}
