"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Floor, Seat, Tenant, User } from "@/API";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalLinearProgressWithLabel from "@/components/MiraCalLinearProgressWithLabel";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { deleteUser } from "@/services/AdminQueries";
import { graphqlDeleteFile, graphqlDeleteFloor, graphqlDeleteSeat, graphqlFloorsByTenantId, graphqlSeatsByTenantId, graphqlUsersByTenantId } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { graphqlDeleteTenant } from "../operation";

type FormValues = {
    key: string,
};

type DeleteTenantDialogProps = {
    isOpened: boolean,
    close: () => void,
    data: Tenant | null,
};

export const DeleteTenantDialog: FC<DeleteTenantDialogProps> = ({
    isOpened,
    close,
    data,
}) => {
    const tenant = data as Tenant;
    const router = useRouter();

    const validationSchema = useMemo(() => yup.object().shape({
        key: yup.string().required().default("").oneOf<string>([`${tenant?.name}を削除する`], `「${tenant?.name}を削除する」と入力してください。`),
    }), [tenant]);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({

    }), [validationSchema]);

    const [progressMessage, setProgressMessage] = useState("");
    const [totalCount, setTotalCount] = useState(1);
    const [currentCount, setCurrentCount] = useState(0);
    const progressValue = 100.0 * currentCount / totalCount;
    const progressLabel = `${currentCount}/${totalCount}`;

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(_values: FormValues) {
            const ret = {
                users: [] as User[],
                seats: [] as Seat[],
                floors: [] as Floor[],
                tenant: tenant,
            };

            // ユーザーを削除
            const users = await graphqlUsersByTenantId(tenant.id);
            setProgressMessage("ユーザーを削除中");
            setTotalCount(users.length);
            setCurrentCount(0);
            for(const user of users) {
                const filePath = `public/${user.tenantId}/users/${user.id}`;
                await graphqlDeleteFile(filePath);
                await deleteUser(user);
                ret.users.push(user);
                setCurrentCount(x => x + 1);
            }

            // 座席を削除
            const seats = await graphqlSeatsByTenantId(tenant.id);
            setProgressMessage("座席を削除中");
            setTotalCount(seats.length);
            setCurrentCount(0);
            for(const seat of seats) {
                ret.seats.push(await graphqlDeleteSeat({ id: seat.id }));
                setCurrentCount(x => x + 1);
            }

            // フロアを削除
            const floors = await graphqlFloorsByTenantId(tenant.id);
            setProgressMessage("フロアを削除中");
            setTotalCount(floors.length);
            setCurrentCount(0);
            for(const floor of floors) {
                const _result = await graphqlDeleteFile(floor.imagePath);
                ret.floors.push(await graphqlDeleteFloor({ id: floor.id }));
                setCurrentCount(x => x + 1);
            }

            // テナントを削除
            ret.tenant = await graphqlDeleteTenant({ id: tenant.id });

            return ret;
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar(`テナント「${tenant.name}」を削除しました。`, { variant: "success" });

            // クエリのキャッシュを更新
            queryClient.setQueryData(queryKeys.graphqlUsersByTenantId(tenant.id), (_items: User[] = []) => []);
            queryClient.setQueryData(queryKeys.graphqlSeatsByTenantId(tenant.id), (_items: Seat[] = []) => []);
            queryClient.setQueryData(queryKeys.graphqlFloorsByTenantId(tenant.id), (_items: Floor[] = []) => []);
            queryClient.setQueryData(queryKeys.graphqlListAllTenants, (items: Tenant[] = []) => items.filter(item => item.id !== tenant.id));

            // ダイアログを閉じる
            close();

            // テナント一覧を表示
            router.push("/sysAdmins/tenants");
        },
        onError(error, _variables, _context) {
            if (!!error.message) {
                enqueueSnackbar(error.message, { variant: "error" });
                return;
            }

            // Error型以外でエラーが飛んでくる場合に対応
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tmp = error as any;
            for (const e of tmp.errors) {
                enqueueSnackbar(e.message, { variant: "error" });
            }
        },
    });

    const onSubmit = useCallback((values: FormValues) => mutation.mutate(values), [mutation]);

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpened} onClose={close}>
            <DialogTitle>テナント削除</DialogTitle>
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm disablePadding disableGap>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <DialogContentText>
                            {`テナントを削除するには、「${tenant?.name}を削除する」と入力してから削除ボタンを押してください。`}
                        </DialogContentText>
                        <MiraCalTextField
                            name="key"
                            type="text"
                        />
                        {mutation.isPending && (
                            <>
                                <DialogContentText>{progressMessage}</DialogContentText>
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
                            削除
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
export default DeleteTenantDialog;
