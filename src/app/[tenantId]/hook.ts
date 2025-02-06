"use client";

import { createContext, useContext } from "react";

export const TenantIdContext = createContext<string>("");
export const useTenantId = () => useContext(TenantIdContext);
