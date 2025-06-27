"use client";

import { FC, useCallback, useMemo } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Seat } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import { useConfirmDialogState } from "@/hooks/confirmDialogState";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { graphqlUpdateSeat } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import DeleteSeatDialog from "./DeleatSeatDialog";

type FormValues = {
    id: string,
    floorId: string,
    name: string,
    posX: number,
    posY: number,
};

type EditSeatDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: Seat | null,

    imageWidth: number,
    imageHeight: number,
};

export const EditSeatDialog: FC<EditSeatDialogProps> = ({
    isOpened,
    close,
    data,
    imageWidth,
    imageHeight,
}) => {
    const tenantId = useTenantId();
    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required(),
        floorId: yup.string().required(),
        name: yup.string().required(),
        posX: yup.number().required().min(30).max(imageWidth - 30),
        posY: yup.number().required().min(30).max(imageHeight - 30),
    }), [imageWidth, imageHeight]);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        id: data?.id ?? "",
        floorId: data?.floorId ?? "",
        name: data?.name ?? "",
        posX: data?.posX ?? 0,
        posY: data?.posY ?? 0,
    }), [validationSchema, data?.id, data?.floorId, data?.name, data?.posX, data?.posY]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const seat = await graphqlUpdateSeat({
                id: values.id,
                floorId: values.floorId,
                name: values.name,
                posX: values.posX,
                posY: values.posY,
            });
            return seat;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar(`座席「${data.name}」を更新しました。`, { variant: "success" });

            // クエリのキャッシュを更新
            queryClient.setQueryData<Seat[]>(queryKeys.graphqlSeatsByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.map(item => item.id === data.id ? data : item);
            });

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

    const seat = data as Seat;
    const confirmDialogState = useConfirmDialogState<Seat>();

    return (
        <>
            <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => !mutation.isPending && close()}>
                <DialogTitle>座席設定</DialogTitle>
                <Formik<FormValues>
                    validationSchema={validationSchema}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    <MiraCalForm disablePadding disableGap>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <MiraCalTextField
                                name="name"
                                label="座席名"
                                type="text"
                            />
                            <MiraCalTextField
                                name="posX"
                                label="X座標"
                                type="number"
                            />
                            <MiraCalTextField
                                name="posY"
                                label="Y座標"
                                type="number"
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 0 }}>
                            <MiraCalButton
                                variant="contained"
                                type="submit"
                                disabled={mutation.isPending}
                                disabledWhenNotDirty={true}
                            >
                                更新
                            </MiraCalButton>
                            <MiraCalButton
                                variant="contained"
                                onClick={() => confirmDialogState.open("座席削除", `座席「${seat.name}」を削除します。`, seat)}
                                disabled={mutation.isPending}
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
            <DeleteSeatDialog {...confirmDialogState} closeParentDialog={close} />
        </>
    );
};
export default EditSeatDialog;
