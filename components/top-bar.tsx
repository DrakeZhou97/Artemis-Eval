"use client";

import type { Environment } from "@/lib/env";
import EnvSwitcher from "./env-switcher";

interface TopBarProps {
	env: Environment;
	onEnvToggle: (env: Environment) => void;
}

export default function TopBar({ env, onEnvToggle }: TopBarProps) {
	return (
		<header className="flex h-16 items-center justify-end border-b border-[var(--color-border)] bg-[var(--color-bg-card)] pr-8">
			<EnvSwitcher env={env} onToggle={onEnvToggle} />
		</header>
	);
}
