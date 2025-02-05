"use client";

import { useGetTenant } from "@/services/graphql";
import { FC, PropsWithChildren } from "react";

type CheckSuspendProps = {
    tenantId: string,
};

export const CheckSuspend: FC<PropsWithChildren<CheckSuspendProps>> = ({
    tenantId,
    children,
}) => {
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
