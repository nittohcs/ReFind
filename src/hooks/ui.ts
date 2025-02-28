"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Amplify } from "aws-amplify";
import { OptionsObject, useSnackbar } from "notistack";
import { useSideBarOpen } from "./sideBar";

export function useUpdatedAt(name: string) {
    const [updatedAt, setUpdatedAt] = useState(name);
    const update = useCallback(() => {
        setUpdatedAt(name + (new Date()).getTime().toString())
    }, [name]);
    return [updatedAt, update] as [string, () => void];
}

export function useEnqueueSnackbar() {
    const { enqueueSnackbar } = useSnackbar();
    const func = useCallback((message: string, options: OptionsObject) => {
        enqueueSnackbar(message, { ...options });
    }, [enqueueSnackbar]);
    return func;
}

export function useMenu() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const openHandler = useCallback((event: MouseEvent<HTMLElement>) => setAnchorEl(event.target as HTMLElement), []);
    const closeHandler = useCallback(() => setAnchorEl(null), []);
    const withClose = useCallback((callback: () => void) => {
        return () => {
            callback();
            closeHandler();
        };
    }, [closeHandler]);

    return {
        anchorEl,
        setAnchorEl,
        openHandler,
        closeHandler,
        withClose,
        isOpened: !!anchorEl,
        // buttonProps: {
        //     onClick: (event: MouseEvent<HTMLElement>) => setAnchorEl(event.target as HTMLElement),
        // },
        menuProps: {
            open: !!anchorEl,
            anchorEl: anchorEl,
            onClose: () => setAnchorEl(null),
        },
    };
}

/**
 * elementRefで参照している要素の下端からウィンドウの描画領域の下端までの高さをcontentsHeightで返す。
 */
export function useContentsSize(defaultWidth: number = 300, defaultHeight: number = 300) {
    const elementRef = useRef<HTMLElement>();
    const [contentsWidth, setContentsWidth] = useState(defaultWidth);
    const [contentsHeight, setContentsHeight] = useState(defaultHeight);
    const [redo, setRedo] = useState(0);
    const open = useSideBarOpen();
    const updateContentsSize = useCallback(() => {
        if (typeof window === "undefined") return;

        try {
            const elem = elementRef.current;
            if (!elem) throw new Error("element does not exist");
            const width = window.innerWidth - elem.offsetLeft;
            const height = window.innerHeight - (elem.offsetTop + elem.clientHeight);
            if (Number.isNaN(width)) throw new Error("width is NaN");
            if (Number.isNaN(height)) throw new Error("height is NaN");
            setContentsWidth(_x => width);
            setContentsHeight(_x => height);
        } catch (_error) {
            setContentsWidth(window.innerWidth);
            setContentsHeight(window.innerHeight);
            if (elementRef.current) {
                setRedo(x => x + 1);  // エラー発生時に値を変更して、もういちどeffectを実行する
            }
        }
    }, []);

    useEffect(() => {
        updateContentsSize();

        window.addEventListener("resize", updateContentsSize);

        return () => window.removeEventListener("resize", updateContentsSize);
    }, [updateContentsSize, redo, open, elementRef]);

    return {
        elementRef,
        contentsWidth,
        contentsHeight,
        updateContentsSize,
    };
}

export function useDialogStateWithData<T>() {
    const [isOpened, setIsOpened] = useState(false);
    const [data, setData] = useState<T | null>(null);

    const open = useCallback((value: T) => {
        setData(value);
        setIsOpened(true);
    }, []);
    const close = useCallback(() => {
        setIsOpened(false);
        setData(null);
    }, []);

    return {
        isOpened,
        open,
        close,
        data,
    };
}

export function useDialogState() {
    const [isOpened, setIsOpened] = useState(false);

    const open = useCallback(() => {
        setIsOpened(true);
    }, []);
    const close = useCallback(() => {
        setIsOpened(false);
    }, []);

    return {
        isOpened,
        open,
        close,
    };
}

export function useEnvName() {
    const env = useMemo(() => {
        const tmp = Amplify.getConfig();
        const endpoint = tmp.API?.REST?.AdminQueries.endpoint ?? "";
        const tokens = endpoint.split("/");
        if (tokens.length === 0) {
            return "";
        }
        return tokens.at(-1);
    }, []);
    return env;
}
