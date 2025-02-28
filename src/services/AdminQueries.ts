"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { get, post } from "aws-amplify/api";
import { CreateUserInput, UpdateUserInput, User } from "@/API";
import { AdminQueriesGroup } from "@/types/user";

/*
async function listAllUsers() {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/listAllUsers";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
    };
    const operation = get({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    const users = json as AdminQueriesUser[];
    return users;
}

export function useListAllUsers(staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.listAllUsers,
        queryFn: listAllUsers,
        ...(!!staleTime && {staleTime }),
    });
}
*/
/*
async function listUsersByTenantId(tenantId: string) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/listUsersByTenantId";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        queryParams: {
            tenantId: tenantId,
        },
    };
    const operation = get({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    const users = json as AdminQueriesUser[];
    return users;
}

export function useListUsersByTenantId(tenantId: string, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.listUsersByTenantId(tenantId),
        async queryFn() { return await listUsersByTenantId(tenantId); },
        ...(!!staleTime && {staleTime }),
    })
}
*/
/*
async function listAllUsersInGroup(groupName: AdminQueriesGroup) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/listAllUsersInGroup";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        queryParams: {
            groupname: groupName,
        },
    };
    const operation = get({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    const users = json as AdminQueriesUser[];
    return users;
}

export function useListAllUsersInGroup(groupName: AdminQueriesGroup, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.listAllUsersInGroup(groupName),
        async queryFn() { return await listAllUsersInGroup(groupName); },
        ...(!!staleTime && {staleTime }),
    });
}
*/
/*
async function listUsersInGroupByTenantId(tenantId: string, groupName: AdminQueriesGroup) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/listUsersInGroupByTenantId";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        queryParams: {
            tenantId: tenantId,
            groupname: groupName,
        },
    };
    const operation = get({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    const users = json as AdminQueriesUser[];
    return users;
}

export function useListUsersInGroupByTenantId(tenantId: string, groupName: AdminQueriesGroup, staleTime?: number) {
    return useQuery({
        queryKey: queryKeys.listUsersInGroupByTenantId(tenantId, groupName),
        async queryFn() { return await listUsersInGroupByTenantId(tenantId, groupName); },
        ...(!!staleTime && {staleTime }),
    });
}
*/

export async function isUsernameAvailable(username: string) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/isAvailableUsername";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        queryParams: {
            username,
        },
    };
    const operation = get({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    const ret = json as { available: boolean };
    return ret.available;
}

export async function adminSetUserPassword(username: string, password: string) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/setUserPassword";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        body: {
            username,
            password,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}

export async function adminUpdateUserAttributes(user: UpdateUserInput) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/updateUserAttributes";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        body: {
            ...user,
            username: user.id,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json as User;
}

/**
 * Cognitoのユーザーを追加する。
 * 既に存在するユーザーと同じIDで追加しようとするとエラー。
 */
export async function createUser(user: CreateUserInput, isSuppress: boolean = true) {
    if (!user.id) {
        throw new Error("empty user id");
    }

    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/createUser";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        body: {
            username: user.id,
            email: user.email,
            name: user.name,
            email_verified: "true",
            tenantId: user.tenantId,
            groupname: user.isAdmin ? "admins" : "users",
            comment: user.comment,

            // SUPPRESSで初回ログイン用パスワードのお知らせメールが送信されなくなる
            ...(isSuppress && { messageAction: "SUPPRESS" }),
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json as User;
}

/**
 * Cognitoのユーザーを削除する。
 * 存在しないユーザーを削除しようとするとエラー。
 */
export async function deleteUser(username: string) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/deleteUser";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        body: {
            username,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}

/**
 * ユーザーをグループに追加する。
 * 既に追加されているグループにもう一度追加しようとしてもエラーは起きない。
 */
export async function addUserToGroup(username: string, group: AdminQueriesGroup) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/addUserToGroup";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        body: {
            username,
            groupname: group,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json as {
        response: {
            message: string,
        },
        updateUser?: User,
    };
}

/**
 * グループからユーザーを削除する。
 * ユーザーが所属していないグループから削除しようとしてもエラーは起きない。
 */
export async function removeUserFromGroup(username: string, group: AdminQueriesGroup) {
    const authSession = await fetchAuthSession();
    const accessToken = authSession.tokens?.accessToken?.toString() ?? "";
    const apiName = "AdminQueries";
    const path = "/removeUserFromGroup";
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
        },
        body: {
            username,
            groupname: group,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json as {
        response: {
            message: string,
        },
        updateUser?: User,
    };
}
