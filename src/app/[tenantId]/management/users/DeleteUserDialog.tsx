"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SeatOccupancy } from "@/API";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useAuthState } from "@/hooks/auth";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useTodayYYYYMMDD } from "@/hooks/util";
import { graphqlDeleteFile } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { ReFindUser } from "@/types/user";
import { useTenantId } from "../../hook";
import { deleteReFindUser } from "./user";

type FormValues = {
    key: string,
};

type DeleteUserDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: ReFindUser[] | null,

    resetRowSelection: () => void,
};

export const DeleteUserDialog: FC<DeleteUserDialogProps> = ({ isOpened, close, data, resetRowSelection }) => {
    const tenantId = useTenantId();
    const authState = useAuthState();
    const includeOperatingUser = !!data && data.some(x => x.id === authState.username);

    const validationSchema = useMemo(() => yup.object().shape({
        key: yup.string().required().default("").oneOf<string>(["delete"], "「delete」を入力してください。"),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
    }), [validationSchema]);

    const today = useTodayYYYYMMDD();

    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(_values: FormValues) {
            setTotalCount((data ?? []).length);
            setCurrentCount(0);
            const deleted = [];
            for(const user of (data ?? [])) {
                const filePath = `public/${tenantId}/users/${user.id}`;
                const _ret = await graphqlDeleteFile(filePath);

                deleted.push(await deleteReFindUser(user));
                setCurrentCount(x => x + 1);
            }
            return deleted;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("ユーザーを削除しました。", { variant: "success" });

            // ユーザー一覧のクエリのキャッシュを更新する
            const deletedUserIds = data.map(x => x.user.id);
            queryClient.setQueryData<ReFindUser[]>(queryKeys.graphqlUsersByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.filter(user => !deletedUserIds.includes(user.id));
            })

            // 座席確保情報のクエリのキャッシュを更新する
            const seatOccupancies = data.map(x => x.seatOccupancy).filter(x => !!x);
            if (seatOccupancies.length > 0) {
                queryClient.setQueryData<SeatOccupancy[]>(queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId), items => {
                    if (!items) {
                        return items;
                    }
                    return [...items, ...seatOccupancies];
                });
            }

            // テーブルの行選択をリセット
            resetRowSelection();

            // ダイアログを閉じる
            close();
        },
        onError(error, _variables, _context) {
            // クエリを再取得
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlUsersByTenantId(tenantId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlSeatOccupanciesByDateAndTenantId(today, tenantId) });

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
            <DialogTitle>ユーザー削除</DialogTitle>
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm disablePadding disableGap>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <DialogContentText>
                            {includeOperatingUser ? (
                                "操作中のユーザーを削除することはできません。"
                            ) : (
                                `選択中の${data?.length}件のユーザーを削除するには「delete」を入力してから削除ボタンを押してください。`
                            )}
                        </DialogContentText>
                        <MiraCalTextField
                            name="key"
                            type="text"
                            disabled={includeOperatingUser}
                        />
                        {mutation.isPending && (
                            <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={includeOperatingUser || mutation.isPending}
                        >
                            削除
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
    );
};
export default DeleteUserDialog;
