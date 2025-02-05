"use client";

import { FC, PropsWithChildren } from "react";
import { useAutoReloadSeatOccupancies } from "@/hooks/graphql";

export const ClientWrapper: FC<PropsWithChildren> = ({ children }) => {
    useAutoReloadSeatOccupancies();
    
    return (
        <>
            {children}
        </>
    );
};
export default ClientWrapper;
