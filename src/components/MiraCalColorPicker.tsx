"use client";

import { FC, ReactNode, useCallback, useState } from "react";
import { SketchPicker, SketchPickerProps } from "react-color";
import { Box, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { useField } from "formik";

type MiraCalColorPickerProps = SketchPickerProps & {
    name: string,
    label?: ReactNode,
};

export const MiraCalColorPicker: FC<MiraCalColorPickerProps> = ({ ...props }) => {
    const [field, meta, helper] = useField(props.name);
    const [open, setOpen] = useState(false);
    const decimalToHex = useCallback((alpha: number) => {
        if (alpha === 0) {
            return "00";
        }
        return Math.round(255 * alpha).toString(16);
    }, []);

    return (
        <FormControl error={!!(meta.touched && meta.error)}>
            <FormControlLabel
                label={props.label}
                control={
                    <Box sx={{ pl: 1.4, pr: 1 }}>
                        <Box
                            sx={{
                                backgroundColor: field.value,
                                width: "5em",
                                height: "2em",
                                border: "1px solid black",
                                borderRadius: "5px",
                            }}
                            onClick={() => setOpen(true)}
                        />
                        {open && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    zIndex: 1000
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "fixed",
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 0
                                    }}
                                    onClick={() => setOpen(false)}
                                />
                                <SketchPicker
                                    color={field.value}
                                    onChange={(color, _event) => helper.setValue(`${color.hex}${decimalToHex(color.rgb.a ?? 0)}`)}
                                    {...props}
                                />
                            </Box>
                        )}
                    </Box>
                }
            />
            <FormHelperText>{meta.touched && meta.error}</FormHelperText>
        </FormControl>
    );
};
export default MiraCalColorPicker;
