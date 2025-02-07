"use client";

import { FC } from "react";
import { Box, BoxProps } from "@mui/material";
import { Seat } from "@/API";

interface SeatBoxProps extends BoxProps {
    seat: Seat,
    isChangeColor?: boolean,
}

export const SeatBox: FC<SeatBoxProps> = ({
    seat,
    isChangeColor,
    children,
    ...boxProps
}) => {
    return (
        <Box
            {...boxProps}
            sx={{
                position: "absolute",
                top: `${seat.posY}px`,
                left: `${seat.posX}px`,
                transform: "translate(-50%, -50%)",
                backgroundColor: isChangeColor ? "rgba(0, 128, 0, 0.75)" : "rgba(128, 128, 128, 0.75)",
                color: "white",
                padding: "5px",
                border: isChangeColor ? "2px solid rgba(0, 255, 0, 0.75)" : "2px solid rgba(255, 255, 255, 0.75)",
                borderRadius: "5px",
                width: "55px",
                height: "55px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {children}
        </Box>
    );
};
export default SeatBox;
