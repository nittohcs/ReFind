"use client";

import { GraphQLResult, graphqlOperation } from "@aws-amplify/api-graphql";
import { useQuery } from "@tanstack/react-query";
import { DeleteFileMutation, DeleteFileMutationVariables, Floor, FloorsByTenantIdQuery, FloorsByTenantIdQueryVariables, FuncClearSeatOccupanciesByTenantIdMutation, FuncClearSeatOccupanciesByTenantIdMutationVariables, funcCreateFloorInput, FuncCreateFloorMutation, FuncCreateFloorMutationVariables, funcCreateSeatInput, FuncCreateSeatMutation, FuncCreateSeatMutationVariables, funcDeleteFloorInput, FuncDeleteFloorMutation, FuncDeleteFloorMutationVariables, funcDeleteSeatInput, FuncDeleteSeatMutation, FuncDeleteSeatMutationVariables, funcUpdateFloorInput, FuncUpdateFloorMutation, FuncUpdateFloorMutationVariables, funcUpdateSeatInput, FuncUpdateSeatMutation, FuncUpdateSeatMutationVariables, GetFileDownloadUrlQuery, GetFileDownloadUrlQueryVariables, GetFileUploadUrlQuery, GetFileUploadUrlQueryVariables, GetTenantQuery, GetTenantQueryVariables, GetUserQuery, GetUserQueryVariables, ListTenantsQuery, ListTenantsQueryVariables, Seat, SeatOccupanciesByDateAndTenantIdQuery, SeatOccupanciesByDateAndTenantIdQueryVariables, SeatOccupanciesByTenantIdQuery, SeatOccupancy, SeatsByTenantIdQuery, SeatsByTenantIdQueryVariables, Tenant, User, UsersByTenantIdQuery, UsersByTenantIdQueryVariables } from "@/API";
import { client } from "@/components/APIClientProvider";
import { deleteFile, funcClearSeatOccupanciesByTenantId, funcCreateFloor, funcCreateSeat, funcDeleteFloor, funcDeleteSeat, funcUpdateFloor, funcUpdateSeat } from "@/graphql/mutations";
import { floorsByTenantId, getFileDownloadUrl, getFileUploadUrl, getTenant, getUser, listTenants, seatOccupanciesByDateAndTenantId, seatOccupanciesByTenantId, seatsByTenantId, usersByTenantId } from "@/graphql/queries";
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

export async function graphqlGetTenant(tenantId: string) {
    if (!tenantId) {
        throw new Error("empty tenantId");
    }

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

export async function graphqlFloorsByTenantId(tenantId: string) {
    if (!tenantId) {
        throw new Error("empty tenantId");
    }

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

export function useSeatsByTenantId(tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlSeatsByTenantId(tenantId),
        queryFn: async () => { return await graphqlSeatsByTenantId(tenantId); },
        ...(!!staleTime && {staleTime }),
    });
}

export async function graphqlSeatsByTenantId(tenantId: string) {
    if (!tenantId) {
        throw new Error("empty tenantId");
    }

    const seats: Seat[] = [];

    let nextToken: NextToken = undefined;
    do {
        const result = await client.graphql(
            graphqlOperation(
                seatsByTenantId,
                {
                    tenantId,
                    nextToken,
                } as SeatsByTenantIdQueryVariables
            )
        ) as GraphQLResult<SeatsByTenantIdQuery>;
        if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
        for(const item of result.data?.seatsByTenantId?.items ?? []) {
            if (item) {
                seats.push(item);
            }
        }
        nextToken = result.data.seatsByTenantId?.nextToken;
    } while(nextToken);

    return seats;
}

export function useSeatOccupanciesByDateAndTenantId(date: string, tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlSeatOccupanciesByDateAndTenantId(date, tenantId),
        async queryFn() { return await graphqlSeatOccupanciesByDateAndTenantId(date, tenantId); },
        ...(!!staleTime && {staleTime }),
    });
}

async function graphqlSeatOccupanciesByDateAndTenantId(date: string, tenantId: string) {
    const seatOccupancies: SeatOccupancy[] = [];

    let nextToken: NextToken = undefined;
    do {
        const result = await client.graphql(
            graphqlOperation(
                seatOccupanciesByDateAndTenantId,
                {
                    date,
                    tenantId: { eq: tenantId },
                    nextToken,
                } as SeatOccupanciesByDateAndTenantIdQueryVariables
            )
        ) as GraphQLResult<SeatOccupanciesByDateAndTenantIdQuery>;
        if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
        for(const item of result.data.seatOccupanciesByDateAndTenantId?.items?? []) {
            if (item) {
                seatOccupancies.push(item);
            }
        }
        nextToken = result.data.seatOccupanciesByDateAndTenantId?.nextToken;
    } while(nextToken);

    return seatOccupancies;
}

export function useSeatOccupanciesByTenantId(tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlSeatOccupanciesByTenantId(tenantId),
        async queryFn() { return await graphqlSeatOccupanciesByTenantId(tenantId); },
        ...(!!staleTime && {staleTime }),
    });
}

async function graphqlSeatOccupanciesByTenantId(tenantId: string) {
    const seatOccupancies: SeatOccupancy[] = [];

    let nextToken: NextToken = undefined;
    do {
        const result = await client.graphql(
            graphqlOperation(
                seatOccupanciesByTenantId,
                {
                    tenantId,
                    nextToken,
                } as SeatOccupanciesByTenantIdQuery
            )
        ) as GraphQLResult<SeatOccupanciesByTenantIdQuery>;
        if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
        for(const item of result.data.seatOccupanciesByTenantId?.items ?? []) {
            if (item) {
                seatOccupancies.push(item);
            }
        }
        nextToken = result.data.seatOccupanciesByTenantId?.nextToken;
    } while(nextToken);

    return seatOccupancies;
}

export async function graphqlClearSeatOccupanciesByTenantId(tenantId: string) {
    const result = await client.graphql(
        graphqlOperation(
            funcClearSeatOccupanciesByTenantId,
            {
                input: {
                    id: tenantId,
                },
            } as FuncClearSeatOccupanciesByTenantIdMutationVariables
        )
    ) as GraphQLResult<FuncClearSeatOccupanciesByTenantIdMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    return result.data.funcClearSeatOccupanciesByTenantId;
}

export function useUsersByTenantId(tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlUsersByTenantId(tenantId),
        async queryFn() { return await graphqlUsersByTenantId(tenantId); },
        ...(!!staleTime && {staleTime }),
    });
}

export async function graphqlUsersByTenantId(tenantId: string) {
    if (!tenantId) {
        throw new Error("empty tenantId");
    }

    const users: User[] = [];

    let nextToken: NextToken = undefined;
    do {
        const result = await client.graphql(
            graphqlOperation(
                usersByTenantId,
                {
                    tenantId,
                    nextToken,
                } as UsersByTenantIdQueryVariables
            )
        ) as GraphQLResult<UsersByTenantIdQuery>;
        if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
        for(const item of result.data.usersByTenantId?.items ?? []) {
            if (item) {
                users.push(item);
            }
        }
        nextToken = result.data.usersByTenantId?.nextToken;
    } while(nextToken);

    return users;
}

export function useGetUser(id: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.graphqlGetUser(id),
        async queryFn() { return await graphqlGetUser(id); },
        ...(!!staleTime && {staleTime }),
    });
}

async function graphqlGetUser(id: string) {
    const result = await client.graphql(
        graphqlOperation(
            getUser,
            {
                id
            } as GetUserQueryVariables
        )
    ) as GraphQLResult<GetUserQuery>;
    if (result.errors || !result.data) { throw new Error(JSON.stringify(result.errors)); }
    return result.data.getUser;
}

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

export async function graphqlUpdateSeat(input: funcUpdateSeatInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcUpdateSeat,
            {
                input,
            } as FuncUpdateSeatMutationVariables
        )
    ) as GraphQLResult<FuncUpdateSeatMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcUpdateSeat) { throw new Error("座席の更新に失敗しました。"); }
    return result.data.funcUpdateSeat;
}

export async function graphqlDeleteSeat(input: funcDeleteSeatInput) {
    const result = await client.graphql(
        graphqlOperation(
            funcDeleteSeat,
            {
                input,
            } as FuncDeleteSeatMutationVariables
        )
    ) as GraphQLResult<FuncDeleteSeatMutation>;
    if (result.errors) { throw new Error(JSON.stringify(result.errors)); }
    if (!result.data.funcDeleteSeat) { throw new Error("座席の削除に失敗しました。"); }
    return result.data.funcDeleteSeat;
}

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

export async function graphqlGetFileDownloadUrl(filePath: string, expiresIn: number) {
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
