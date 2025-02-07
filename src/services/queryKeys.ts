import { AdminQueriesGroup } from "@/types/user";

export const queryKeys = {
    storage: (path: string) => ["storage", path] as const,
    listAllUsers: ["cognitoUser"] as const,
    listAllUsersInGroup: (groupName: AdminQueriesGroup) => [...queryKeys.listAllUsers, groupName] as const,
    graphqlListAllTenants: ["Tenant"] as const,
    graphqlGetTenant: (tenantId: string) => ["Tenant", tenantId] as const,
    graphqlFloorsByTenantId: (tenantId: string) => ["Floor", tenantId] as const,
    graphqlSeatsByTenantId: (tenantId: string) => ["Seat", tenantId] as const,
    graphqlSeatOccupanciesByDateAndTenantId: (date: string, tenantId: string) => ["SeatOccupanciesByDateAndString", date, tenantId] as const,
};
