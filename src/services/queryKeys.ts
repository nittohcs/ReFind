
export const queryKeys = {
    storage: (path: string) => ["storage", path] as const,
    graphqlListAllTenants: ["Tenant"] as const,
    graphqlGetTenant: (tenantId: string) => ["Tenant", tenantId] as const,
    graphqlFloorsByTenantId: (tenantId: string) => ["Floor", tenantId] as const,
    graphqlSeatsByTenantId: (tenantId: string) => ["Seat", tenantId] as const,
    graphqlSeatOccupanciesByDateAndTenantId: (date: string, tenantId: string) => ["SeatOccupanciesByDateAndTenantId", date, tenantId] as const,
    graphqlSeatOccupanciesByTenantId: (tenantId: string) => ["SeatOccupanciesByTenantId", tenantId] as const,
    graphqlUsersByTenantId: (tenantId: string) => ["User", tenantId] as const,
};
