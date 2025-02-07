"use client";

import { FC, PropsWithChildren } from "react";
import { SeatOccupancyContext, useSeatOccupancyValue } from "@/hooks/seatOccupancy";
import { useTenantId } from "./hook";

export const ReFindProvider: FC<PropsWithChildren> = ({ children }) => {
    const tenantId = useTenantId();
    const seatOccupancyValue = useSeatOccupancyValue(tenantId);
    return (
        <SeatOccupancyContext.Provider value={seatOccupancyValue}>
            {children}
        </SeatOccupancyContext.Provider>
    );
};
