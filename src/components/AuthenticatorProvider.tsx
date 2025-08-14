"use client";

import { FC, PropsWithChildren } from "react";
import { Authenticator } from "@aws-amplify/ui-react";

export const AuthenticatorProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Authenticator.Provider>
            {children}
        </Authenticator.Provider>
    )
};
export default AuthenticatorProvider;
