"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export type AuthGroup = {
    sysAdmins?: boolean | null,
    admins?: boolean | null,
    users?: boolean | null,
};

export type AuthState = {
    username?: string | null,
    name?: string | null,
    email?: string | null,
    email_verified?: boolean | null,    // TODO これ不要では？
    groups?: AuthGroup | null,
    tenantId?: string | null,
};

const defaultAuthState: AuthState = {
    username: undefined,
    name: undefined,
    email: undefined,
    groups: undefined,
    tenantId: undefined,
};

export type UpdateUserInfoOptions = {
    name?: string,
    email?: string,
};
export type UpdateUserInfoFunc = (_options: UpdateUserInfoOptions) => void;
const defaultUpdateUserInfoFunc: UpdateUserInfoFunc = _options => {};

export const AuthStateContext = createContext<AuthState>(defaultAuthState);
export const UpdateUserInfoContext = createContext<UpdateUserInfoFunc>(defaultUpdateUserInfoFunc);

export function useAuthContextValue() {
    const [state, setState] = useState(defaultAuthState);

    useEffect(() => {
        async function fetchCurrentState() {
            try {
                const session = (await fetchAuthSession({ forceRefresh: true }));
                const username = session.tokens?.idToken?.payload["cognito:username"] as string ?? "";
                const name = session.tokens?.idToken?.payload["name"] as string ?? "";
                const email = session.tokens?.idToken?.payload["email"] as string ?? "";
                const email_verified = session.tokens?.idToken?.payload["email_verified"] as boolean ?? false;
                const tmp = session.tokens?.accessToken.payload["cognito:groups"] as string[] ?? [];
                const groups = {
                    sysAdmins: tmp.includes("sysAdmins"),
                    admins: tmp.includes("admins"),
                    users: tmp.includes("users"),
                };
                const tenantId = session.tokens?.idToken?.payload["custom:tenantId"] as string ?? "";
                setState(s => {
                    const ns: AuthState = {
                        ...s,
                        username: username,
                        name: name,
                        email: email,
                        email_verified: email_verified,
                        groups: groups,
                        tenantId: tenantId,
                    };
                    return ns;
                });
            } catch(_error) {
                //return state;
                //console.log(error);
            }
        };

        const hubListenerCancel = Hub.listen("auth", ({ payload }) => {
            switch (payload.event) {
                case "tokenRefresh":
                    // ここでfetchCurrentState()を呼ぶとtokenRefreshが継続して発生するようになる
                    //console.log(`auth.ts: ${payload.event}`)
                    //fetchCurrentState();
                    break;
                case "signInWithRedirect":
                case "signedIn":
                    //console.log(`auth.ts: ${payload.event}`)
                    fetchCurrentState();
                    break;
                case "signInWithRedirect_failure":
                case "tokenRefresh_failure":
                case "signedOut":
                    //console.log(`auth.ts: ${payload.event}`)
                    setState(defaultAuthState);
                    break;
                default:
                    //console.log(`auth.ts: ${payload.event}`)
                    break;
            }
        });
        fetchCurrentState();
        return () => hubListenerCancel();
    }, []);

    const updateFunc: UpdateUserInfoFunc = useCallback(({ name, email }) => {
        setState(state => {
            const ns: AuthState = {
                ...state,
                name: name ?? state.name,
                email: email ?? state.email,
            };
            return ns;
        });
    }, []);

    return { authState: state, updateUserInfo: updateFunc };
};

export const useAuthState = () => useContext(AuthStateContext);
export const useUpdateUserInfo = () => useContext(UpdateUserInfoContext);
