"use client";

import { FC, useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField, useFormikContext } from "formik";

type MiraCalTextFieldProps = TextFieldProps & {
    name: string,
    debounceTime?: number,
}

export const MiraCalTextField: FC<MiraCalTextFieldProps> = ({
    debounceTime = 0,
    ...props
}) => {
    const [field, meta, _helper] = useField(props.name);
    const { setFieldValue } = useFormikContext();
    const [localValue, setLocalValue] = useState(field.value);

    useEffect(() => {
        if (debounceTime <= 0) {
            return;
        }

        const handler = setTimeout(() => {
            if (localValue !== field.value) {
                setFieldValue(props.name, localValue);
            }
        }, debounceTime);

        return () => {
            clearTimeout(handler);
        };
    }, [localValue, debounceTime, setFieldValue, props.name, field.value]);

    return (
        <TextField
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
            }}
            error={!!(meta.touched && meta.error)}
            helperText={meta.touched && meta.error}
            {...props}
            {...field}
            value={debounceTime === 0 ? field.value : localValue}
            onChange={(e) => {
                if (debounceTime === 0) {
                    setFieldValue(props.name, e.target.value);
                } else {
                    setLocalValue(e.target.value);
                }
            }}
        />
    );
};
export default MiraCalTextField;
