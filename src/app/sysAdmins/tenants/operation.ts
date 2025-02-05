"use client";

import { CreateTenantInput, CreateTenantMutation, CreateTenantMutationVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { createTenant } from "@/graphql/mutations";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";

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
