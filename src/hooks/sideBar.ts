"use client";

import { createContext, useContext } from "react";

export const SideBarOpenContext = createContext(false);
export const useSideBarOpen = () => useContext(SideBarOpenContext);
