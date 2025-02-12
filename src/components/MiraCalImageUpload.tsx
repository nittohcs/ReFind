"use client";

import { ChangeEvent, FC, RefObject, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Box, Button, TextField } from "@mui/material";
import { useField } from "formik";
import { useStorageFileURL } from "@/hooks/storage";

export const ImageUploadState = {
    Upload: "upload",
    Delete: "delete",
    Unchange: "unchange",
} as const;

type MiraCalImageUploadProps = {
    name: string,
    label: string,
    currentFilePath: string | null,
    accept?: string,
    fileRef: RefObject<HTMLInputElement>
    canDelete?: boolean,
};

// このコンポーネントではファイルそのものではなく、操作内容（アップロード、削除、変更なし）をFormikで管理する値とし、
// ファイルへのアクセスはinput要素へのref経由で行う
export const MiraCalImageUpload: FC<MiraCalImageUploadProps> = ({ ...props }) => {
    const [imageUrl, setImageUrl] = useState("");
    const [field, meta, helper] = useField(props.name);
    const isSetFilePath = !!props.currentFilePath;
    const textFieldValue = useMemo(() => field.value === ImageUploadState.Upload ? "アップロード" :
                                         field.value === ImageUploadState.Delete ? "削除" :
                                         !!props.currentFilePath ? "変更なし" :
                                         "未選択"
                                    , [field.value, props.currentFilePath]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = (e.target.files && e.target.files[0]) ?? null;
        helper.setValue(selectedFile ? ImageUploadState.Upload : ImageUploadState.Unchange);

        if (selectedFile?.type.startsWith('image/')) {
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
        } else {
            setImageUrl("");
        }
    }, [helper]);
    const onClickDelete = useCallback(() => {
        helper.setValue(ImageUploadState.Delete);
    }, [helper]);
    const onClickReset = useCallback(() => {
        helper.setValue(ImageUploadState.Unchange);
        if (props.fileRef.current) {
            props.fileRef.current.value = "";
        }
    }, [helper, props.fileRef]);

    const downloadQuery = useStorageFileURL(props.currentFilePath);
                                    
    return (
        <Box>
            <Box>
                <TextField
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label={props.label}
                    value={textFieldValue}
                    disabled
                    fullWidth
                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched && meta.error}
                />
            </Box>
            <Box>
                {field.value === ImageUploadState.Unchange && downloadQuery.isFetched && downloadQuery.data && (
                    <Image
                        src={downloadQuery.data}
                        alt="現在の画像"
                        width={300}
                        height={300}
                    />
                )}
                {field.value === ImageUploadState.Upload && (
                    <Image
                        src={imageUrl}
                        alt="選択された画像"
                        // style={{
                        //     maxWidth: "300px",
                        //     maxHeight: "300px",
                        // }}
                        width={300}
                        height={300}
                    />
                )}
            </Box>
            <Box>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    // 変更時は非表示にする
                    // 他のボタンのように存在そのものを消すとinput要素のrefが動かなくなるため
                    sx={{ display: field.value !== ImageUploadState.Unchange ? "none" : undefined }}
                >
                    ファイル選択
                    <input
                        type="file"
                        accept={props.accept}
                        hidden
                        ref={props.fileRef}
                        onChange={onChange}
                    />
                </Button>
                {props.canDelete && isSetFilePath && field.value === ImageUploadState.Unchange && (
                    <Button
                        variant="contained"
                        onClick={onClickDelete}
                    >
                        削除
                    </Button>
                )}
                {field.value !== ImageUploadState.Unchange && (
                    <Button
                        variant="contained"
                        onClick={onClickReset}
                    >
                        リセット
                    </Button>
                )}
            </Box>
        </Box>
    );
};
