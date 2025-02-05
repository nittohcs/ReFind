"use client";

import { GraphQLResult, graphqlOperation } from "@aws-amplify/api-graphql";
import { ListTenantsQuery, ListTenantsQueryVariables, Tenant } from "@/API";
import { client } from "@/components/APIClientProvider";
import { NextToken } from "@/types/graphql";
import { useQuery } from "@tanstack/react-query";
import { listTenants } from "@/graphql/queries";
import { queryKeys } from "./queryKeys";

export function useListAllTenants(staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.listAllTenants,
        queryFn: graphqlListAllTenants,
        ...(!!staleTime && {staleTime }),
    });
}

async function graphqlListAllTenants() {
    const tenants: Tenant[] = [];

    let nextToken: NextToken = undefined;
    do {
        const result = await client.graphql(
            graphqlOperation(
                listTenants,
                {
                    nextToken,
                } as ListTenantsQueryVariables
            )
        ) as GraphQLResult<ListTenantsQuery>;
        if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
        for(const item of result.data.listTenants?.items ?? []) {
            if (item) {
                tenants.push(item);
            }
        }
        nextToken = result.data.listTenants?.nextToken;
    } while(nextToken);

    return tenants;
}
