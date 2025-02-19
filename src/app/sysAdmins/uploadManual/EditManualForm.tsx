"use client";

import { FC, RefObject, useCallback, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";
import MiraCalForm from "@/components/MiraCalForm";
import { FileUploadState, MiraCalFileUpload } from "@/components/MiraCalFileUpload";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { graphqlGetFileUploadUrl } from "@/services/graphql";
import { adminManualPath, userManualPath } from "@/services/manual";
import { queryKeys } from "@/services/queryKeys";

type FormValues = {
    userManual: string,
    adminManual: string,
};

type EditManualFormProps = {
    update: () => void,
};

export const EditManualForm: FC<EditManualFormProps> = ({
    update,
}) => {
    const validationSchema = useMemo(() => yup.object().shape({
        userManual: yup.string().required(),
        adminManual: yup.string().required(),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        userManual: FileUploadState.Unchange,
        adminManual: FileUploadState.Unchange,
    }), [validationSchema]);

    const userManualFileRef = useRef<HTMLInputElement>(null);
    const adminManualFileRef = useRef<HTMLInputElement>(null);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            function getFile(ref: RefObject<HTMLInputElement>) {
                return ref.current?.files && ref.current.files.length > 0 ? ref.current.files[0] : undefined;
            }
            async function uploadFile(filePath: string, file: File) {
                const fileTypeResult = await fileTypeFromBlob(file);
                const presignedUrl = await graphqlGetFileUploadUrl(filePath);
                const response = await fetch(presignedUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": fileTypeResult?.mime ?? "",
                    }
                });
                if (!response.ok) {
                    throw new Error("保存に失敗しました。");
                }
            }

            if (values.userManual === FileUploadState.Upload) {
                const file = getFile(userManualFileRef);
                await uploadFile(userManualPath, file!);
            }
            if (values.adminManual === FileUploadState.Upload) {
                const file = getFile(adminManualFileRef);
                await uploadFile(adminManualPath, file!);
            }
        },
        onSuccess(_data, _variables, _context) {
            enqueueSnackbar("保存しました。", { variant: "success" });

            // 画像取得クエリを無効化して再取得されるようにする
            if (_variables.userManual === FileUploadState.Upload) {
                queryClient.invalidateQueries({ queryKey: queryKeys.storage(userManualPath) });
            }
            if (_variables.adminManual === FileUploadState.Upload) {
                queryClient.invalidateQueries({ queryKey: queryKeys.storage(adminManualPath) });
            }

            // コンポーネントを再生成
            update();
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
        <Box maxWidth="sm">
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                <MiraCalForm>
                    <MiraCalFileUpload
                        name="userManual"
                        label="ユーザーマニュアル"
                        currentFilePath={userManualPath}
                        accept="application/pdf"
                        fileRef={userManualFileRef}
                    />
                    <MiraCalFileUpload
                        name="adminManual"
                        label="管理者マニュアル"
                        currentFilePath={adminManualPath}
                        accept="application/pdf"
                        fileRef={adminManualFileRef}
                    />
                    <MiraCalFormAction>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={mutation.isPending}
                            disabledWhenNotDirty={true}
                        >
                            保存
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default EditManualForm;
