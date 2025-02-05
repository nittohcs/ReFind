/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type FloorCreateFormInputValues = {
    tenantId?: string;
    name?: string;
    imagePath?: string;
    imageWidth?: number;
    imageHeight?: number;
};
export declare type FloorCreateFormValidationValues = {
    tenantId?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    imagePath?: ValidationFunction<string>;
    imageWidth?: ValidationFunction<number>;
    imageHeight?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FloorCreateFormOverridesProps = {
    FloorCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    tenantId?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    imagePath?: PrimitiveOverrideProps<TextFieldProps>;
    imageWidth?: PrimitiveOverrideProps<TextFieldProps>;
    imageHeight?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FloorCreateFormProps = React.PropsWithChildren<{
    overrides?: FloorCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FloorCreateFormInputValues) => FloorCreateFormInputValues;
    onSuccess?: (fields: FloorCreateFormInputValues) => void;
    onError?: (fields: FloorCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FloorCreateFormInputValues) => FloorCreateFormInputValues;
    onValidate?: FloorCreateFormValidationValues;
} & React.CSSProperties>;
export default function FloorCreateForm(props: FloorCreateFormProps): React.ReactElement;
