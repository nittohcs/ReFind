"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";
import { useTenantId } from "../hook";

type LayoutProps = {
    children: React.ReactNode,
};

export default function Layout({ children }: LayoutProps) {
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
