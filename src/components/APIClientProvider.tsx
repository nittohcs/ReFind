"use client";

import { generateClient } from "aws-amplify/api";
import { FC, PropsWithChildren } from "react";

export const client = generateClient();

export const APIClientProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

export default APIClientProvider;
