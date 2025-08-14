"use client";

import { Button, ButtonProps } from "@mui/material";
import { useFormikContext } from "formik";
import { FC } from "react";

type MiraCalButtonProps = ButtonProps & {
    disabledWhenNotDirty?: boolean,
};

export const MiraCalButton: FC<MiraCalButtonProps> = ({ disabledWhenNotDirty, children, ...props }) => {
    const { dirty, handleReset } = useFormikContext();

    const newProps = {
        ...props,
        // disabledWhenNotDirtyがtrueの場合、フォームの値が初期値と同じならボタンを押せなくする
        disabled: props.disabled || (disabledWhenNotDirty && !dirty),
        // typeがresetでonClickが未設定ならhandleResetでフォームを初期値に戻すようにする
        onClick: (props.type === "reset" && !props.onClick) ? handleReset : props.onClick,
    };

    return (
        <Button {...newProps}>
            {children}
        </Button>
    );
};
export default MiraCalButton;
