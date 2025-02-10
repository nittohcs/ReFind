"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";
import { useTenantId } from "../hook";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    const tenantId = useTenantId();
    const authState = useAuthState();
    const router = useRouter();

    // adminsじゃないならテナントのトップページに飛ばす
    useEffect(() => {
        if (!authState.groups?.admins) {
            router.push(`/${tenantId}`);
        }
    }, [authState, router, tenantId]);

    // adminsじゃないなら何も返さない
    if (!authState.groups?.admins) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
};
export default Layout;
