"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import MiraCalButton from "@/components/MiraCalButton";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { ReFindUser } from "@/types/user";
import { adminSetUserPassword } from "@/services/AdminQueries";

type FormValues = {
    password: string,
};

type ResetPasswordDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: ReFindUser[] | null,
    resetRowSelection: () => void,
};

export const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({
    isOpened,
    close,
    data,
    resetRowSelection,
}) => {
    const validationSchema = useMemo(() => yup.object().shape({
        password: yup.string().required().min(8),
    }), []);

    const initialValues = useMemo(() => validationSchema.cast({
        password: "",
    }), [validationSchema]);

    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const users = data ?? [];
            setTotalCount(users.length);
            setCurrentCount(0);
            for(const user of users) {
                await adminSetUserPassword(user, values.password);
                setCurrentCount(x => x + 1);
            }
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("選択したユーザーのパスワードをリセットしました。", { variant: "success" });

            // テーブルの行選択をリセット
            resetRowSelection();

            // ダイアログを閉じる
            close();
        },
        onError(error, _variables, _context) {
            if (!!error.message) {
                enqueueSnackbar(error.message, { variant: "error" });
                return;
            }

            // Error型以外でエラーが飛んでくる場合に対応
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tmp = error as any;
            for(const e of tmp.errors) {
                enqueueSnackbar(e.message, { variant: "error" });
            }
        },
    });
    const onSubmit = useCallback((values: FormValues) => mutation.mutate(values), [mutation]);

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => !mutation.isPending && close()}>
            <DialogTitle>パスワードリセット</DialogTitle>
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm disablePadding disableGap>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <DialogContentText>
                            入力したパスワードを選択したユーザーの仮パスワードとして設定します。
                        </DialogContentText>
                        <MiraCalTextField
                            name="password"
                            label="パスワード"
                            type="password"
                        />
                        {mutation.isPending && (
                            <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            パスワード変更
                        </MiraCalButton>
                        <MiraCalButton
                            variant="contained"
                            onClick={close}
                            disabled={mutation.isPending}
                        >
                            キャンセル
                        </MiraCalButton>
                    </DialogActions>
                </MiraCalForm>
            </Formik>
        </Dialog>
    )
};
export default ResetPasswordDialog;
