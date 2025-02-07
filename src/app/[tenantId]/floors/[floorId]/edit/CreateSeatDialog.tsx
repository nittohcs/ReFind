"use client";

import { FC, useCallback, useMemo } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Seat } from "@/API";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { graphqlCreateSeat } from "./operation";
import { useTenantId } from "@/app/[tenantId]/hook";

type FormValues = {
    floorId: string,
    name: string,
    posX: number,
    posY: number,
};

type CreateSeatDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: Seat | null,

    imageWidth: number,
    imageHeight: number,
};

export const CreateSeatDialog: FC<CreateSeatDialogProps> = ({
    isOpened,
    close,
    data: dialogData,
    imageWidth,
    imageHeight,
}) => {
    const tenantId = useTenantId();
    const validationSchema = useMemo(() => yup.object().shape({
        floorId: yup.string().required(),
        name: yup.string().required(),
        posX: yup.number().required().min(30).max(imageWidth - 30),
        posY: yup.number().required().min(30).max(imageHeight - 30),
    }), [imageWidth, imageHeight]);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        floorId: dialogData?.floorId ?? "",
        name: dialogData?.name ?? "",
        posX: dialogData?.posX ?? 0,
        posY: dialogData?.posY ?? 0
    }), [validationSchema, dialogData?.floorId, dialogData?.name, dialogData?.posX, dialogData?.posY]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            const seat = await graphqlCreateSeat({
                tenantId: tenantId,
                floorId: values.floorId,
                name: values.name,
                posX: values.posX,
                posY: values.posY,
            });
            return seat;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar(`座席「${data.name}」を作成しました。`, { variant: "success" });

            // クエリのキャッシュに登録したデータを追加する
            queryClient.setQueryData(queryKeys.graphqlSeatsByTenantId(tenantId), (item: Seat[] = []) => [...item, data]);

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
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={close}>
            <DialogTitle>座席作成</DialogTitle>
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
                    <DialogActions sx={{ p: 3, pt: 0}}>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            作成
                        </MiraCalButton>
                        <MiraCalButton
                            variant="contained"
                            onClick={close}
                        >
                            キャンセル
                        </MiraCalButton>
                    </DialogActions>
                </MiraCalForm>
            </Formik>
        </Dialog>
    );
};
export default CreateSeatDialog;
