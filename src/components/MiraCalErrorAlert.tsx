import { FC, useMemo } from "react";
import { Alert, Stack } from "@mui/material";

type MiraCalErrorAlertProps = {
    error: Error | null,
};

export const MiraCalErrorAlert: FC<MiraCalErrorAlertProps> = ({ error }) => {
    const messages = useMemo(() => {
        if (!error) {
            return null;
        }
        // TODO エラーメッセージを日本語化
        return Array.isArray(error) ? error.map(x => x.message) : [error.message];
    }, [error]);

    if (!messages) {
        return null;
    }

    return (
        <Stack
            direction="column"
            gap={2}
        >
            {messages.map((message, key) => (
                <Alert key={key} severity="error">{message}</Alert>
            ))}
        </Stack>
    );
};
export default MiraCalErrorAlert;
