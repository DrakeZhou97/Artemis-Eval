"use client";

import { useContext } from "react";
import { EnvContext } from "./env-context";

export function useEnv() {
	return useContext(EnvContext);
}
