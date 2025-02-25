"use client";

import { FC, RefObject, useCallback, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";
import { useTenantId } from "@/app/[tenantId]/hook";
import { Floor } from "@/API";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import { ImageUploadState, MiraCalImageUpload } from "@/components/MiraCalImageUpload";
import MiraCalButton from "@/components/MiraCalButton";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import { useConfirmDialogState } from "@/hooks/confirmDialogState";
import { uploadFile } from "@/hooks/storage";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { useFloorsByTenantId } from "@/services/graphql";
import { graphqlUpdateFloor } from "@/services/graphql";
import { queryKeys } from "@/services/queryKeys";
import { convertBMPtoPNG } from "@/services/util";
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
    const tenantId = useTenantId();
    const query = useFloorsByTenantId(tenantId);
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
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            function getFile(ref: RefObject<HTMLInputElement>) {
                return ref.current?.files && ref.current?.files.length > 0 ? ref.current.files[0] : undefined;
            }
            let file = getFile(imageFileRef);

            let imagePath: string | undefined = undefined;
            if (values.image === ImageUploadState.Upload && file) {
                imagePath = `public/${tenantId}/floors/${values.id}`;

                // BMPの場合、PNGに変換
                const fileType = await fileTypeFromBlob(file);
                if (fileType?.mime === "image/bmp") {
                    const blob = await convertBMPtoPNG(file);
                    file = new File([blob], `${file.name}.png`, { type: "image/png" });
                }

                const response = await uploadFile(imagePath, file);
                if (!response.ok) {
                    throw new Error("登録に失敗しました。");
                }
            }

            // テーブル更新
            return await graphqlUpdateFloor({
                id: values.id,
                tenantId: tenantId,
                name: values.name,
                ...(!!imagePath && { imagePath }),
                imageWidth: values.imageWidth,
                imageHeight: values.imageHeight,
            });
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("フロアを更新しました。", { variant: "success" });

            // クエリのキャッシュを更新する
            queryClient.setQueryData(queryKeys.graphqlFloorsByTenantId(tenantId), (items: Floor[] = []) => items.map(item => item.id === data.id ? data : item));

            // 画像URLのクエリを無効化して再取得されるようにする
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
    const onSubmit = useCallback((values: FormValues) => mutation.mutate(values), [mutation]);

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
                        accept="image/png, image/webp, image/jpeg, image/bmp"
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
                            disabled={mutation.isPending}
                            disabledWhenNotDirty={true}
                        >
                            保存
                        </MiraCalButton>
                        <MiraCalButton
                            variant="contained"
                            onClick={() => floor && confirmDialogState.open("フロア削除", `フロア「${floor.name}」を削除します。`, floor)}
                            disabled={mutation.isPending}
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
