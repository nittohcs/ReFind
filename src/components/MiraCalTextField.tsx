"use client";

import { FC } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

type MiraCalTextFieldProps = TextFieldProps & {
    name: string,
}

export const MiraCalTextField: FC<MiraCalTextFieldProps> = ({ ...props }) => {
    const [field, meta, _helper] = useField(props.name);

    return (
        <TextField
            InputLabelProps={{
                shrink: true,
                ...props.InputLabelProps,
            }}
            error={!!(meta.touched && meta.error)}
            helperText={meta.touched && meta.error}
            {...props}
            {...field}
        />
    );
};
export default MiraCalTextField;