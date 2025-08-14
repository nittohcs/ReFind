"use client";

import { FC, ReactNode } from "react";
import { Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText } from "@mui/material";
import { useField } from "formik";

type MiraCalCheckboxProps = CheckboxProps & {
    name: string,
    label?: ReactNode,
};

export const MiraCalCheckbox: FC<MiraCalCheckboxProps> = ({ ...props }) => {
    const [field, meta, helper] = useField(props.name);

    return (
        <FormControl error={!!(meta.touched && meta.error)}>
            <FormControlLabel
                label={props.label}
                control={
                    <Checkbox
                        checked={field.value}
                        onChange={(_event, checked) => helper.setValue(checked)}
                        {...props}
                    />
                }
            />
            <FormHelperText>{meta.touched && meta.error}</FormHelperText>
        </FormControl>
    );
};
export default MiraCalCheckbox;
