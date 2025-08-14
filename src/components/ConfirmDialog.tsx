"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FC } from "react";
import MiraCalLinearProgressWithLabel from "./MiraCalLinearProgressWithLabel";

type ConfirmDialogProps = {
    isOpened: boolean,
    close: () => void,
    title: string,
    message: string,
    onConfirm: () => void,
    isPending: boolean,
    progressMessage?: string,
    progressValue?: number,
    progressLabel?: string,
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
    isOpened,
    close,
    title,
    message,
    onConfirm,
    isPending,
    progressMessage,
    progressValue,
    progressLabel,
}) => {
    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => !isPending && close()}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DialogContentText>{message}</DialogContentText>
                {isPending && progressMessage && progressValue !== undefined && progressLabel !== undefined && (
                    <>
                        <DialogContentText>{progressMessage}</DialogContentText>
                        <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={isPending}
                >
                    OK
                </Button>
                <Button
                    variant="contained"
                    onClick={close}
                    disabled={isPending}
                >
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;
