"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { get, post } from "aws-amplify/api";
import { useQuery } from "@tanstack/react-query";
import { AdminQueriesGroup, AdminQueriesUser } from "@/types/user";
import { queryKeys } from "./queryKeys";

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

export async function adminSetUserPassword(user: AdminQueriesUser, password: string) {
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
            username: user.id,
            password: password,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}

export async function adminUpdateUserAttributes(user: AdminQueriesUser) {
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
            username: user.id,
            email: user.email,
            name: user.name,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}

/**
 * Cognitoのユーザーを追加する。
 * 既に存在するユーザーと同じIDで追加しようとするとエラー。
 */
export async function createUser(user: AdminQueriesUser, isSuppress: boolean = true) {
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

            // SUPPRESSで初回ログイン用パスワードのお知らせメールが送信されなくなる
            ...(isSuppress && { messageAction: "SUPPRESS" }),
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}

/**
 * Cognitoのユーザーを削除する。
 * 存在しないユーザーを削除しようとするとエラー。
 */
export async function deleteUser(user: AdminQueriesUser) {
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
            username: user.id,
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
export async function addUserToGroup(user: AdminQueriesUser, group: AdminQueriesGroup) {
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
            username: user.id,
            groupname: group,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}

/**
 * グループからユーザーを削除する。
 * ユーザーが所属していないグループから削除しようとしてもエラーは起きない。
 */
export async function removeUserFromGroup(user: AdminQueriesUser, group: AdminQueriesGroup) {
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
            username: user.id,
            groupname: group,
        },
    };
    const operation = post({ apiName, path, options });
    const response = await operation.response;
    const json = await response.body.json();
    return json;
}
