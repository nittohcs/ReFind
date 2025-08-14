"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";

export default function Home() {
  const router = useRouter();
  const authState = useAuthState();
  
  useEffect(() => {
    if (authState.username) {
      if (authState.groups?.sysAdmins) {
        router.replace("/sysAdmins");
      } else {
        router.replace(`/${authState.tenantId}/`);
      }
    }
  }, [authState, router]);
  
  return null;
}
