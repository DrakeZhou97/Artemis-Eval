"use client";

import { createContext } from "react";
import { DEFAULT_ENV, type Environment } from "./env";

export interface EnvContextValue {
	env: Environment;
	setEnv: (env: Environment) => void;
}

export const EnvContext = createContext<EnvContextValue>({
	env: DEFAULT_ENV,
	setEnv: () => {},
});
