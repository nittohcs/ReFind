"use client";

import { GraphQLResult, graphqlOperation } from "@aws-amplify/api-graphql";
import { useQuery } from "@tanstack/react-query";
import { Floor, FloorsByTenantIdQuery, FloorsByTenantIdQueryVariables, GetTenantQuery, GetTenantQueryVariables, ListTenantsQuery, ListTenantsQueryVariables, Tenant } from "@/API";
import { client } from "@/components/APIClientProvider";
import { floorsByTenantId, getTenant, listTenants } from "@/graphql/queries";
import { NextToken } from "@/types/graphql";
import { queryKeys } from "./queryKeys";

export function useListAllTenants(staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlListAllTenants,
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

export function useGetTenant(tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlGetTenant(tenantId),
        queryFn: async () => { return await graphqlGetTenant(tenantId); },
        ...(!!staleTime && {staleTime }),
    })
}

async function graphqlGetTenant(tenantId: string) {
    const result = await client.graphql(
        graphqlOperation(
            getTenant,
            {
                id: tenantId,
            } as GetTenantQueryVariables
        )
    ) as GraphQLResult<GetTenantQuery>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data) { throw new Error(`テナントの取得に失敗しました(id=「${tenantId}」)。`); }
    return result.data.getTenant;
}

export function useFloorsByTenantId(tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlFloorsByTenantId(tenantId),
        queryFn: async () => { return await graphqlFloorsByTenantId(tenantId); },
        ...(!!staleTime && {staleTime }),
    });
}

async function graphqlFloorsByTenantId(tenantId: string) {
    const floors: Floor[] = [];

    let nextToken: NextToken = undefined;
    do {
        const result = await client.graphql(
            graphqlOperation(
                floorsByTenantId,
                {
                    tenantId,
                    nextToken,
                } as FloorsByTenantIdQueryVariables
            )
        ) as GraphQLResult<FloorsByTenantIdQuery>;
        if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
        for(const item of result.data?.floorsByTenantId?.items ?? []) {
            if (item) {
                floors.push(item);
            }
        }
        nextToken = result.data.floorsByTenantId?.nextToken;
    } while(nextToken);

    return floors;
}

