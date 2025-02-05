"use client";

import { useAutoReloadSeatOccupancies } from "@/hooks/graphql";
import { FC, PropsWithChildren } from "react";

export const ClientWrapper: FC<PropsWithChildren> = ({ children }) => {
    //useAutoReloadSeatOccupancies();
    
    return (
        <>
            {children}
        </>
    );
};
export default ClientWrapper;
