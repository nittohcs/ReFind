"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type DebouncedTextFieldProps = {
    value: string,
    debounce?: number,
    onChange: (value: string) => void,
} & Omit<TextFieldProps, "onChange">;

export const DebouncedTextField: FC<DebouncedTextFieldProps> = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, SetValue] = useState(initialValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);
        return () => clearTimeout(timeout);
    }, [debounce, onChange, value]);

    const handleClear = useCallback(() => {
        SetValue("");
        onChange("");
    }, [onChange]);

    return (
        <TextField
            value={value}
            onChange={e => SetValue(e.target.value)}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClear}
                                edge="end"
                                size="small"
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }}
            {...props}
        />
    );
};
export default DebouncedTextField;
