"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";

type LayoutProps = {
    children: React.ReactNode,
    params: {
        tenantId: string,
    },
};

export default function Layout({ children, params}: LayoutProps) {
    const tenantId = decodeURIComponent(params.tenantId);
    const authState = useAuthState();
    const router = useRouter();
    
    // URLのテナントIDがユーザーのテナントIDと異なっていたら正しいURLに飛ばす
    useEffect(() => {
        if (authState.username) {
            if (tenantId !== authState.tenantId) {
                router.push(`/${authState.tenantId}`);
            }
        }
    }, [authState, tenantId, router]);

    // authState読込前は何も返さない
    if (!authState.username) {
        return null;
    }

    // テナントIDが異なる場合は何も返さない
    if (authState.tenantId !== tenantId) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}
