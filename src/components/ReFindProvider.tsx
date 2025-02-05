"use client";

import { FC, PropsWithChildren } from "react";
import { SeatOccupancyContext, useSeatOccupancyValue } from "@/hooks/seatOccupancy";

export const ReFindProvider: FC<PropsWithChildren> = ({ children }) => {
    const seatOccupancyValue = useSeatOccupancyValue();
    return (
        <SeatOccupancyContext.Provider value={seatOccupancyValue}>
            {children}
        </SeatOccupancyContext.Provider>
    );
};
