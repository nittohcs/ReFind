"use client";

import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { FC, PropsWithChildren } from "react";

type MiraCalFormProps = PropsWithChildren & {
    disablePadding?: boolean,
    disableGap?: boolean,
};

export const MiraCalForm: FC<MiraCalFormProps> = ({
    children,
    disablePadding = false,
    disableGap = false,
}) => {
    const { handleSubmit } = useFormikContext();
    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={disableGap ? 0 : 2}
            p={disablePadding ? 0 : 2}
        >
            {children}
        </Box>
    );
};
export default MiraCalForm;
