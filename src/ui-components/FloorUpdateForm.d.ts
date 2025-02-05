/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Floor } from "../API.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type FloorUpdateFormInputValues = {
    tenantId?: string;
    name?: string;
    imagePath?: string;
    imageWidth?: number;
    imageHeight?: number;
};
export declare type FloorUpdateFormValidationValues = {
    tenantId?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    imagePath?: ValidationFunction<string>;
    imageWidth?: ValidationFunction<number>;
    imageHeight?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FloorUpdateFormOverridesProps = {
    FloorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    tenantId?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    imagePath?: PrimitiveOverrideProps<TextFieldProps>;
    imageWidth?: PrimitiveOverrideProps<TextFieldProps>;
    imageHeight?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FloorUpdateFormProps = React.PropsWithChildren<{
    overrides?: FloorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    floor?: Floor;
    onSubmit?: (fields: FloorUpdateFormInputValues) => FloorUpdateFormInputValues;
    onSuccess?: (fields: FloorUpdateFormInputValues) => void;
    onError?: (fields: FloorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FloorUpdateFormInputValues) => FloorUpdateFormInputValues;
    onValidate?: FloorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function FloorUpdateForm(props: FloorUpdateFormProps): React.ReactElement;
