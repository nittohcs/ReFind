import { Stack } from "@mui/material";
import { FC, PropsWithChildren } from "react";

export const MiraCalFormAction: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Stack
            direction="row"
            justifyContent="start"
            spacing={2}
        >
            {children}
        </Stack>
    );
};
export default MiraCalFormAction;
