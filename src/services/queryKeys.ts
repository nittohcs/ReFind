import { AdminQueriesGroup } from "@/types/user";

export const queryKeys = {
    listAllUsers: ["cognitoUser"] as const,
    listAllUsersInGroup: (groupName: AdminQueriesGroup) => [...queryKeys.listAllUsers, groupName] as const,
    listAllTenants: ["Tenant"] as const,
    getTenant: (tenantId: string) => ["Tenant", tenantId] as const,
};
