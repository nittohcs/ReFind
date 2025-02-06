"use client";

import { FC, RefObject, useCallback, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileTypeFromBlob } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { Floor } from "@/API";
import { useTenantId } from "@/app/[tenantId]/hook";
import MiraCalForm from "@/components/MiraCalForm";
import MiraCalTextField from "@/components/MiraCalTextField";
import { ImageUploadState, MiraCalImageUpload } from "@/components/MiraCalImageUpload";
import MiraCalFormAction from "@/components/MiraCalFormAction";
import MiraCalButton from "@/components/MiraCalButton";
import { useEnqueueSnackbar } from "@/hooks/ui";
import { queryKeys } from "@/services/queryKeys";
import { graphqlCreateFloor, graphqlGetFileUploadUrl } from "../operation";

type FormValues = {
    name: string,
    image: string,
    imageWidth: number,
    imageHeight: number,
};

type CreateFloorFormProps = {
    update: () => void,
};

export const CreateFloorForm: FC<CreateFloorFormProps> = ({
    update,
}) => {
    const tenantId = useTenantId();

    const validationSchema = useMemo(() => yup.object().shape({
        name: yup.string().required(),
        image: yup.string().required().oneOf([ImageUploadState.Upload], "ファイルを選択してください。"),
        imageWidth: yup.number().required().min(1),
        imageHeight: yup.number().required().min(1),
    }), []);

    const initialValues: FormValues = useMemo(() => validationSchema.cast({
        name: "",
        image: ImageUploadState.Unchange,
        imageWidth: 0,
        imageHeight: 0,
    }), [validationSchema]);

    const imageFileRef = useRef<HTMLInputElement>(null);

    const enqueueSnackbar = useEnqueueSnackbar();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(values: FormValues) {
            function getFile(ref: RefObject<HTMLInputElement>) {
                return ref.current?.files && ref.current?.files.length > 0 ? ref.current.files[0] : undefined;
            }
            const file = getFile(imageFileRef);

            const id = uuidv4();
            const imagePath = `public/${tenantId}/floors/${id}`;
            if (values.image === ImageUploadState.Upload && file) {
                // ファイルタイプ
                const fileTypeResult = await fileTypeFromBlob(file);

                // アップロード用URLを取得
                const presignedUrl = await graphqlGetFileUploadUrl(imagePath) ?? "";

                // アップロード
                const response = await fetch(presignedUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": fileTypeResult?.mime ?? "", // ファイルのMIMEタイプを指定
                    },
                });
                if (!response.ok) {
                    throw new Error("登録に失敗しました。");
                }
            }
            
            // テーブル登録
            return await graphqlCreateFloor({
                id,
                tenantId,
                name: values.name,
                imagePath,
                imageWidth: values.imageWidth,
                imageHeight: values.imageHeight,
            });
        },
        onSuccess(data, _variables, _context) {
            enqueueSnackbar("登録しました。", { variant: "success" });

            // フロア一覧取得クエリを無効化して再取得されるようにする
            //queryClient.invalidateQueries({ queryKey: queryKeys.graphqlListAllFloors });

            // 登録したフロアをキャッシュに追加
            queryClient.setQueryData(queryKeys.graphqlFloorsByTenantId(tenantId), (items: Floor[] = []) => [...items, data]);

            // このコンポーネントを再表示させる
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
    })
    const onSubmit = useCallback((values: FormValues) => mutation.mutate(values), [mutation]);

    return (
        <Box maxWidth="sm">
            <Formik<FormValues>
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <MiraCalForm>
                    <MiraCalTextField
                        name="name"
                        label="名前"
                        type="text"
                    />
                    <MiraCalImageUpload
                        name="image"
                        label="画像"
                        currentFilePath={null}
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
                            disabled={mutation.isPending}
                        >
                            登録
                        </MiraCalButton>
                    </MiraCalFormAction>
                </MiraCalForm>
            </Formik>
        </Box>
    );
};
export default CreateFloorForm;
