"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";
import SysAdminsMainUI from "./SysAdminsMainUI";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const authState = useAuthState();

    // sysAdmins以外が表示しようとしたら/に飛ばす
    useEffect(() => {
        if (authState.username) {
            if (!authState.groups?.sysAdmins) {
                router.push("/");
            }
        }
    }, [authState, router]);

    if (!authState.username) {
        return null;
    }

    if (!authState.groups?.sysAdmins) {
        return null;
    }

    return (
        <SysAdminsMainUI>
            {children}
        </SysAdminsMainUI>
    );
}
