"use client"

import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/auth";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const authState = useAuthState();
  
  useEffect(() => {
    if (authState.username && !authState.groups?.sysAdmins) {
      if (authState.groups?.sysAdmins) {
        router.push("/sysAdmin");
      } else {
        router.push(`/${authState.tenantId}/`);
      }
    }
  }, [authState, router]);
  
  return null;
}
