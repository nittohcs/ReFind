"use client";

import { useCallback, useState } from "react";

export type ConfirmDialogState<T,> = {
    isOpened: boolean,
    open: (title: string, message: string, data: T) => void,
    close: () => void,
    data: T | null,
    title: string,
    message: string,
};

export function useConfirmDialogState<T,>() {
    const [isOpened, setIsOpened] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const open = useCallback((title: string, message: string, value: T) => {
        setTitle(title);
        setMessage(message);
        setData(value);
        setIsOpened(true);
    }, []);
    const close = useCallback(() => {
        setIsOpened(false);
        setData(null);
        setMessage("");
        setTitle("");
    }, []);

    return {
        isOpened,
        open,
        close,
        data,
        title,
        message,
    };
}
