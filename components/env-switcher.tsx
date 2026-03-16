"use client";

import type { Environment } from "@/lib/env";

interface EnvSwitcherProps {
	env: Environment;
	onToggle: (env: Environment) => void;
}

export default function EnvSwitcher({ env, onToggle }: EnvSwitcherProps) {
	const isProd = env === "prod";

	function handleSwitch(next: Environment) {
		if (next === env) return;
		onToggle(next);
		window.location.reload();
	}

	return (
		<div className="flex items-center gap-3">
			<span className="text-sm leading-5 tracking-[-0.15px] text-[var(--color-text-secondary)]">Environment</span>
			<div className="relative flex h-9 w-[148px] items-center rounded-[var(--radius-pill)] bg-[var(--color-bg-input)] p-1">
				{/* Sliding indicator */}
				<div
					className="absolute top-1 h-7 w-[68px] rounded-[var(--radius-pill)] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
					style={{
						left: isProd ? "calc(100% - 72px)" : "4px",
						background: isProd
							? "linear-gradient(135deg, #ef4444, #f97316)"
							: "linear-gradient(135deg, var(--color-blue), #6366f1)",
						boxShadow: isProd ? "0 2px 8px rgba(239, 68, 68, 0.3)" : "0 2px 8px rgba(20, 71, 230, 0.3)",
					}}
				/>
				<button
					type="button"
					onClick={() => handleSwitch("dev")}
					className={`relative z-10 flex h-7 w-[68px] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border-none bg-transparent text-xs font-semibold tracking-wide transition-colors duration-300 ${
						!isProd ? "text-white" : "text-[var(--color-text-tertiary)]"
					}`}
				>
					DEV
				</button>
				<button
					type="button"
					onClick={() => handleSwitch("prod")}
					className={`relative z-10 flex h-7 w-[68px] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border-none bg-transparent text-xs font-semibold tracking-wide transition-colors duration-300 ${
						isProd ? "text-white" : "text-[var(--color-text-tertiary)]"
					}`}
				>
					PROD
				</button>
			</div>
		</div>
	);
}
