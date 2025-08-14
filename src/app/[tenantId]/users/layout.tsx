"use client";

import { ReFindUsersContext, useReFindUsersValue } from "@/hooks/ReFindUser";

export default function Layout({
    children
}: {
    children: React.ReactNode,
}) {
    const value = useReFindUsersValue();
    return (
        <ReFindUsersContext.Provider value={value}>
            {children}
        </ReFindUsersContext.Provider>
    );
}
