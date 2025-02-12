"use client";

import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { CreateTenantInput, CreateTenantMutation, CreateTenantMutationVariables, DeleteTenantInput, DeleteTenantMutation, DeleteTenantMutationVariables, UpdateTenantInput, UpdateTenantMutation, UpdateTenantMutationVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { createTenant, deleteTenant, updateTenant } from "@/graphql/mutations";

export async function graphqlCreateTenant(input: CreateTenantInput) {
    const result = await client.graphql(
        graphqlOperation(
            createTenant,
            {
                input,
            } as CreateTenantMutationVariables
        )
    ) as GraphQLResult<CreateTenantMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.createTenant) { throw new Error("テナントの登録に失敗しました。"); }
    return result.data.createTenant;
}

export async function graphqlDeleteTenant(input: DeleteTenantInput) {
    const result = await client.graphql(
        graphqlOperation(
            deleteTenant,
            {
                input,
            } as DeleteTenantMutationVariables
        )
    ) as GraphQLResult<DeleteTenantMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.deleteTenant) { throw new Error("テナントの削除に失敗しました。"); }
    return result.data.deleteTenant;
}

export async function graphqlUpdateTenant(input: UpdateTenantInput) {
    const result = await client.graphql(
        graphqlOperation(
            updateTenant,
            {
                input,
            } as UpdateTenantMutationVariables
        )
    ) as GraphQLResult<UpdateTenantMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.updateTenant) { throw new Error("テナントの更新に失敗しました。"); }
    return result.data.updateTenant;
}
