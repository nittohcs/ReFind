"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FC } from "react";

type ConfirmDialogProps = {
    isOpened: boolean,
    close: () => void,
    title: string,
    message: string,
    onConfirm: () => void,
    isPending: boolean,
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
    isOpened,
    close,
    title,
    message,
    onConfirm,
    isPending,
}) => {
    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={close}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DialogContentText>{message}</DialogContentText>
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
                >
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;
