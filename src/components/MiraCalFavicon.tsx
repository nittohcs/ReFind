"use client";

import { useEnvName } from "@/hooks/ui";

export const MiraCalFavicon = () => {
    const envName = useEnvName();
    return (
        <>
            {envName && (
                <link rel="icon" href={`/img/favicon-${envName}.png`} sizes="any" />
            )}
        </>
    );
};
export default MiraCalFavicon;
