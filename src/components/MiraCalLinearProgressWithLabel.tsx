import { FC } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

type MiraCalLinearProgressWithLabelProps = {
    value: number,
    label: string,
};

export const MiraCalLinearProgressWithLabel: FC<MiraCalLinearProgressWithLabelProps> = ({
    value,
    label,
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ minWidth: 20 }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
            <Box sx={{ width: '100%', ml: 1 }}>
                <LinearProgress variant="determinate" value={value} />
            </Box>
        </Box>
    );
};
export default MiraCalLinearProgressWithLabel;
