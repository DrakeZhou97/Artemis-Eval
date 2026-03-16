"use client";

import type { ReactNode } from "react";
import { useEnv } from "@/lib/use-env";
import Sidebar from "./sidebar";
import TopBar from "./top-bar";

interface AppShellProps {
	children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
	const { env, setEnv } = useEnv();

	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden bg-[var(--color-bg-page)]">
				<TopBar env={env} onEnvToggle={setEnv} />
				<main className="flex-1 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
