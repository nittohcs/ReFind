"use client";

import { FC, PropsWithChildren } from "react";
import { useGetTenant } from "@/services/graphql";
import { useTenantId } from "./hook";

export const CheckSuspend: FC<PropsWithChildren> = ({
    children,
}) => {
    const tenantId = useTenantId();
    const query = useGetTenant(tenantId);

    // データ取得中
    if (!query.isFetched) {
        return null;
    }

    // テナントが存在しない
    if (!query.data) {
        return null;
    }

    // 利用停止中
    if (query.data.isSuspended) {
        return (
            <>利用停止中です。</>
        );
    }

    return (
        <>{children}</>
    );
};
export default CheckSuspend;
