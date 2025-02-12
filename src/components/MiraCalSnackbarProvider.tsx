"use client";

import { SnackbarProvider } from "notistack";
import { FC, PropsWithChildren } from "react";

export const MiraCalSnackbarProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <SnackbarProvider autoHideDuration={3000}>
            {children}
        </SnackbarProvider>
    );
};
export default MiraCalSnackbarProvider;
