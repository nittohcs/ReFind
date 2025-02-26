"use client";

import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parse } from "csv-parse/sync";
import { Floor, Seat } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import { FileUploadState, MiraCalFileUpload } from "@/components/MiraCalFileUpload";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { graphqlCreateSeat, graphqlDeleteSeat } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";

type FormValues = {
    csv: string,
};

type ImportCSVDialogProps = {
    isOpened: boolean,
    close: () => void,
    floor: Floor,
    seats: Seat[],
};

export const ImportCSVDialog: FC<ImportCSVDialogProps> = ({
    isOpened,
    close,
    floor,
    seats,
}) => {
    const tenantId = useTenantId();
    const fileRef = useRef<HTMLInputElement>(null);

    const [message, setMessage] = useState("");
    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const validationSchema = useMemo(() => yup.object().shape({
        csv: yup.string().required().oneOf([FileUploadState.Upload], "ファイルを選択してください。"),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        csv: FileUploadState.Unchange,
    }), [validationSchema]);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(_values: FormValues) {
            const readFileAsText = (file: File) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (event.target && typeof event.target.result === "string") {
                            resolve(event.target.result);
                        } else {
                            reject(new Error("Failed to load file"));
                        }
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsText(file);
                });
            };

            const getSeatsFromCsv = (csv: string) => {
                const seats: Seat[] = [];

                try {
                    const rows: { [key: string]: string | undefined }[] = parse(csv, {
                        columns: true,
                        skip_empty_lines: true,
                        relax_column_count:true,
                    });

                    for(const row of rows) {
                        const seat: Seat = {
                            __typename: "Seat",
                            id: row["id"] ?? "",
                            tenantId: row["tenantId"] ?? "",
                            floorId: row["floorId"] ?? "",
                            name: row["name"] ?? "",
                            posX: parseInt(row["posX"] ?? ""),
                            posY: parseInt(row["posY"] ?? ""),
                            createdAt: row["createdAt"] ?? "",
                            updatedAt: row["updatedAt"] ?? "",
                        };
                        seats.push(seat);
                    }
                } catch(error) {
                    console.log(error);
                }

                return seats;
            };

            const ret = {
                deleted: [] as Seat[],
                created: [] as Seat[],
            };

            if (!fileRef.current?.files) {
                return ret;
            }

            // 既存の座席を削除する
            setMessage("既存の座席を削除しています。");
            setTotalCount(seats.length);
            setCurrentCount(0);
            for(const seat of seats) {
                ret.deleted.push(await graphqlDeleteSeat({
                    id: seat.id,
                }));
                setCurrentCount(x => x + 1);
            }

            // CSVから座席を読み込み、登録する
            const csv = await readFileAsText(fileRef.current.files[0]);
            const newSeats = getSeatsFromCsv(csv);
            setMessage("CSVから座席を登録しています。");
            setTotalCount(newSeats.length)
            setCurrentCount(0);
            for (const seat of newSeats) {
                ret.created.push(await graphqlCreateSeat({
                    //id: seat.id,
                    tenantId: tenantId,
                    floorId: floor.id,
                    name: seat.name,
                    posX: seat.posX,
                    posY: seat.posY,
                }));
                setCurrentCount(x => x + 1);
            }

            return ret;
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("インポートが完了しました。", { variant: "success" });

            // クエリのキャッシュから削除されたSeatを削除する
            const deletedSet = new Set(data.deleted.map(x => x.id));
            queryClient.setQueryData<Seat[]>(queryKeys.graphqlSeatsByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return items.filter(item => !deletedSet.has(item.id));
            });

            // クエリのキャッシュに登録されたSeatを追加する
            queryClient.setQueryData<Seat[]>(queryKeys.graphqlSeatsByTenantId(tenantId), items => {
                if (!items) {
                    return items;
                }
                return [...items, ...data.created];
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

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={() => !mutation.isPending && close()}>
            <DialogTitle>CSVインポート</DialogTitle>
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm disablePadding disableGap>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <DialogContentText>既存の座席をすべて削除し、CSVエクスポートで保存したファイルを読み込んで座席を新規登録します。</DialogContentText>
                        <MiraCalFileUpload
                            name="csv"
                            label="CSVファイル"
                            accept="text/csv"
                            fileRef={fileRef}
                        />
                        {mutation.isPending && (
                            <>
                                <DialogContentText>{message}</DialogContentText>
                                <MiraCalLinearProgressWithLabel value={progressValue} label={progressLabel} />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            インポート
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
export default ImportCSVDialog;
