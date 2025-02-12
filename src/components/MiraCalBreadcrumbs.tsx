import { FC, PropsWithChildren } from "react";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const MiraCalBreadcrumbs: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
        >
            {children}
        </Breadcrumbs>
    );
};
export default MiraCalBreadcrumbs;
