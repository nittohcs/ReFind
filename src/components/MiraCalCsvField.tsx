"use client";

import { ChangeEventHandler, FC, useCallback, useId } from "react";
import { Button, Stack, TextFieldProps } from "@mui/material";
import { useField } from "formik";
import MiraCalTextField from "@/components/MiraCalTextField";

type MiraCalCsvFieldProps = TextFieldProps & {
    name: string,
    sampleUrl?: string,
};

export const MiraCalCsvField: FC<MiraCalCsvFieldProps> = ({ sampleUrl, ...props }) => {
    const [_field, _meta, helper] = useField(props.name);
    const fileInputId = useId();
    const downloadFileName = sampleUrl?.split("/").pop() ?? "file";

    const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
        if (!event.target.files) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            const result = fileReader.result;
            if (!(result instanceof ArrayBuffer)) {
                return;
            }
            const arrayBuffer = new Uint8Array(result);
            const textDecoder = new TextDecoder();
            const text = textDecoder.decode(arrayBuffer);
            helper.setValue(text);
        });
        fileReader.readAsArrayBuffer(event.target.files[0]);

        // ファイル未選択状態にして同じファイルが選択されたときにもう一度処理が実行されるようにする
        event.target.value = "";
    }, [helper]);

    return (
        <Stack spacing={2}>
            <MiraCalTextField
                {...props}
                multiline
                minRows={5}
                maxRows={10}
            />
            <Stack direction="row" spacing={2}>
                <Button component="label" htmlFor={fileInputId}>
                    ファイル選択
                    <input
                        accept="text/*"
                        id={fileInputId}
                        hidden
                        type="file"
                        onChange={fileChangeHandler}
                    />
                </Button>
                {sampleUrl && (
                    <Button
                        component="a"
                        href={sampleUrl}
                        download={downloadFileName}
                    >
                        テンプレートファイルをダウンロード
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};
export default MiraCalCsvField;
