"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";
import CheckSuspend from "./CheckSuspend";
import TenantMainUI from "./TenantMainUI";
import { TenantIdContext } from "./hook";
import { ReFindProvider } from "./ReFindProvider";
import AutoReloadSeatOccupancies from "./AutoReloadSeatOccupancies";

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
    // sysAdminsの場合は飛ばさない
    useEffect(() => {
        if (authState.username) {
            if (tenantId !== authState.tenantId && !authState.groups?.sysAdmins) {
                router.push(`/${authState.tenantId}`);
            }
        }
    }, [authState, tenantId, router]);

    // authState読込前は何も返さない
    if (!authState.username) {
        return null;
    }

    // テナントIDが異なる場合は何も返さない
    if (authState.tenantId !== tenantId && !authState.groups?.sysAdmins) {
        return null;
    }

    return (
        <TenantIdContext.Provider value={tenantId}>
            <ReFindProvider>
                <TenantMainUI>
                    <CheckSuspend>
                        <AutoReloadSeatOccupancies>
                            {children}
                        </AutoReloadSeatOccupancies>
                    </CheckSuspend>
                </TenantMainUI>
            </ReFindProvider>
        </TenantIdContext.Provider>
    );
}
