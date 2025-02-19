"use client";

import { ChangeEvent, FC, RefObject, useCallback, useMemo } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useField } from "formik";
import { useDownloadStorageFile } from "@/hooks/storage";

export const FileUploadState = {
    Upload: "upload",
    Delete: "delete",
    Unchange: "unchange",
} as const;
//export type FileUploadStatus = typeof FileUploadState[keyof typeof FileUploadState];

type MiraCalFileUploadProps = {
    name: string,
    label: string,
    currentFilePath?: string | null,
    accept?: string,
    fileRef: RefObject<HTMLInputElement>
    canDelete?: boolean,
};

// このコンポーネントではファイルそのものではなく、操作内容（アップロード、削除、変更なし）をFormikで管理する値とし、
// ファイルへのアクセスはinput要素へのref経由で行う
export const MiraCalFileUpload: FC<MiraCalFileUploadProps> = ({ ...props }) => {
    const [field, meta, helper] = useField(props.name);
    const isSetFilePath = !!props.currentFilePath;
    const selectedFile = (props.fileRef.current?.files && props.fileRef.current.files[0]) ?? null;
    const textFieldValue = useMemo(() => field.value === FileUploadState.Upload ? "アップロード: " + selectedFile?.name :
                                         field.value === FileUploadState.Delete ? "削除" :
                                         !!props.currentFilePath ? "変更なし: " + props.currentFilePath :
                                         "未選択"
                                    , [field.value, selectedFile, props.currentFilePath]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = (e.target.files && e.target.files[0]) ?? null;
        helper.setValue(selectedFile ? FileUploadState.Upload : FileUploadState.Unchange);
    }, [helper]);
    const onClickDelete = useCallback(() => {
        helper.setValue(FileUploadState.Delete);
    }, [helper]);
    const onClickReset = useCallback(() => {
        helper.setValue(FileUploadState.Unchange);
        if (props.fileRef.current) {
            props.fileRef.current.value = "";
        }
    }, [helper, props.fileRef]);

    const download = useDownloadStorageFile();

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
                {field.value === FileUploadState.Unchange && isSetFilePath && (
                    <Button
                        variant="contained"
                        onClick={async () => await download(props.currentFilePath)}
                    >
                        ダウンロード
                    </Button>
                )}
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    // 変更時は非表示にする
                    // 他のボタンのように存在そのものを消すとinput要素のrefが動かなくなるため
                    sx={{ display: field.value !== FileUploadState.Unchange ? "none" : undefined }}
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
                {props.canDelete && isSetFilePath && field.value === FileUploadState.Unchange && (
                    <Button
                        variant="contained"
                        onClick={onClickDelete}
                    >
                        削除
                    </Button>
                )}
                {field.value !== FileUploadState.Unchange && (
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
