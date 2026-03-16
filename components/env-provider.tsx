"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_ENV, type Environment } from "@/lib/env";
import { EnvContext } from "@/lib/env-context";

const STORAGE_KEY = "artemis-env";
const COOKIE_KEY = "artemis-env";

function readStoredEnv(): Environment {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "dev" || stored === "prod") return stored;
	return DEFAULT_ENV;
}

function setEnvCookie(env: Environment) {
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks broad support; document.cookie is reliable here.
	document.cookie = `${COOKIE_KEY}=${env};path=/;max-age=31536000;samesite=lax`;
}

export default function EnvProvider({ children }: { children: ReactNode }) {
	// Always start with DEFAULT_ENV so server and client render the same initial HTML.
	const [env, setEnvState] = useState<Environment>(DEFAULT_ENV);

	// After hydration, sync from localStorage and set the cookie.
	useEffect(() => {
		const stored = readStoredEnv();
		setEnvCookie(stored);
		setEnvState(stored);
	}, []);

	const setEnv = useCallback((next: Environment) => {
		localStorage.setItem(STORAGE_KEY, next);
		setEnvCookie(next);
		setEnvState(next);
	}, []);

	return <EnvContext.Provider value={{ env, setEnv }}>{children}</EnvContext.Provider>;
}
