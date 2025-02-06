"use client";

import { FC, RefObject, useCallback, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadData } from 'aws-amplify/storage';
import { fileTypeFromBlob } from "file-type";
import { Floor } from "@/API";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import { ImageUploadState, MiraCalImageUpload } from "@/components/MiraCalImageUpload";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import { useConfirmDialogState } from "@/hooks/confirmDialogState";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useListAllFloors } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { graphqlUpdateFloor } from "../operation";
import DeleteFloorDialog from "./DeleteFloorDialog";

type FormValues = {
    id: string,
    name: string,
    image: string,
    imageWidth: number,
    imageHeight: number,
};

type EditFloorFormProps = {
    floorId: string,
    update: () => void,
};

export const EditFloorForm: FC<EditFloorFormProps> = ({
    floorId,
    update,
}) => {
    const query = useListAllFloors();
    const floor = useMemo(() => (query.data ?? []).find(x => x.id === floorId) ?? null, [query.data, floorId]);

    const validationSchema = useMemo(() => yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
        image: yup.string().required(),
        imageWidth: yup.number().required().min(1),
        imageHeight: yup.number().required().min(1),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        id: floor?.id ?? "",
        name: floor?.name ?? "",
        image: ImageUploadState.Unchange,
        imageWidth: floor?.imageWidth ?? 0,
        imageHeight: floor?.imageHeight?? 0,
    }), [validationSchema, floor]);

    const imageFileRef = useRef<HTMLInputElement>(null);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        async mutationFn(values: FormValues) {
            function getFile(ref: RefObject<HTMLInputElement>) {
                return ref.current?.files && ref.current?.files.length > 0 ? ref.current.files[0] : undefined;
            }
            const file = getFile(imageFileRef);

            let imagePath: string | undefined = undefined;
            if (values.image === ImageUploadState.Upload && file) {
                imagePath = `public/floors/${values.id}`;
                const fileTypeResult = await fileTypeFromBlob(file);
                const _result = await uploadData({
                    path: imagePath,
                    data: file,
                    options: {
                        contentType: fileTypeResult?.mime,
                    },
                }).result;
            }

            // テーブル更新
            return await graphqlUpdateFloor({
                id: values.id,
                name: values.name,
                ...(!!imagePath && { imagePath }),
                imageWidth: values.imageWidth,
                imageHeight: values.imageHeight,
            });
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("フロアを更新しました。", { variant: "success" });

            // フロア取得クエリを無効化して再取得されるようにする
            queryClient.invalidateQueries({ queryKey: queryKeys.graphqlListAllFloors });

            // 画像取得クエリを無効化して再取得されるようにする
            if (data.imagePath) {
                queryClient.invalidateQueries({ queryKey: queryKeys.storage(data.imagePath) });
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
    const onSubmit = useCallback((values: FormValues) => updateMutation.mutate(values), [updateMutation]);

    const confirmDialogState = useConfirmDialogState<Floor>();

    return (
        <Box maxWidth="sm">
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="id"
                        label="ID"
                        type="text"
                        disabled={true}
                    />
                    <MiraCalTextField
                        name="name"
                        label="名前"
                        type="text"
                    />
                    <MiraCalImageUpload
                        name="image"
                        label="画像"
                        currentFilePath={floor?.imagePath ?? null}
                        accept="image/png, image/webp, image/jpeg"
                        fileRef={imageFileRef}
                    />
                    <MiraCalTextField
                        name="imageWidth"
                        label="画像表示幅"
                        type="number"
                    />
                    <MiraCalTextField
                        name="imageHeight"
                        label="画像表示高さ"
                        type="number"
                    />
                    <MiraCalFormAction>
                        <MiraCalButton
                            variant="contained"
                            type="submit"
                            disabled={updateMutation.isPending}
                        >
                            保存
                        </MiraCalButton>
                        <MiraCalButton
                            variant="contained"
                            onClick={() => floor && confirmDialogState.open("フロア削除", `フロア「${floor.name}」を削除します。`, floor)}
                            disabled={updateMutation.isPending}
                        >
                            削除
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
            <DeleteFloorDialog {...confirmDialogState} />
        </Box>
    );
};
export default EditFloorForm;
