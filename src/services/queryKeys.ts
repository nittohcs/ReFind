import { AdminQueriesGroup } from "@/types/user";

export const queryKeys = {
    storage: (path: string) => ["storage", path] as const,
    listUsersByTenantId: (tenantId: string) => ["cognitoUser", tenantId] as const,
    listUsersInGroupByTenantId: (tenantId: string, groupName: AdminQueriesGroup) => [...queryKeys.listUsersByTenantId(tenantId), groupName] as const,
    graphqlListAllTenants: ["Tenant"] as const,
    graphqlGetTenant: (tenantId: string) => ["Tenant", tenantId] as const,
    graphqlFloorsByTenantId: (tenantId: string) => ["Floor", tenantId] as const,
    graphqlSeatsByTenantId: (tenantId: string) => ["Seat", tenantId] as const,
    graphqlSeatOccupanciesByDateAndTenantId: (date: string, tenantId: string) => ["SeatOccupanciesByDateAndString", date, tenantId] as const,
};
