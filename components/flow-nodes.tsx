"use client";

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GraphFlowNode } from "@/lib/graph-layout";

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

// --- START node ---
export function StartNode(_props: NodeProps) {
	return (
		<div className="flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-text-heading)] px-6 py-2.5 shadow-lg">
			<span className="text-[13px] font-semibold tracking-wide text-white">START</span>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!bg-[var(--color-text-heading)] !border-none !w-2 !h-2"
			/>
		</div>
	);
}

// --- END node ---
export function EndNode(_props: NodeProps) {
	return (
		<div className="flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-text-heading)] px-6 py-2.5 shadow-lg">
			<Handle
				type="target"
				position={Position.Top}
				className="!bg-[var(--color-text-heading)] !border-none !w-2 !h-2"
			/>
			<span className="text-[13px] font-semibold tracking-wide text-white">END</span>
		</div>
	);
}

// --- Agent node ---
export function AgentNode({ data }: NodeProps<GraphFlowNode>) {
	const router = useRouter();
	const { nodeDef, prompt } = data;
	const isActive = prompt?.is_active ?? false;

	const handleClick = () => {
		if (prompt) {
			router.push(`/prompts/${encodeURIComponent(nodeDef.key)}`);
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`group relative min-w-[260px] max-w-[280px] rounded-[var(--radius-node)] border bg-[var(--color-bg-card)] px-5 py-4 text-left transition-all duration-300 hover:shadow-xl ${
				prompt ? "cursor-pointer" : ""
			} ${
				isActive
					? "border-2 border-[var(--color-primary)] shadow-[0_0_0_4px_rgba(130,0,219,0.08)]"
					: "border-[var(--color-border-card)] shadow-sm"
			}`}
		>
			{/* Glow effect on hover */}
			<div className="pointer-events-none absolute inset-0 rounded-[var(--radius-node)] bg-gradient-to-br from-[var(--color-primary)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]" />

			{/* Active pulse ring */}
			{isActive && (
				<div className="pointer-events-none absolute -inset-[3px] animate-pulse rounded-[calc(var(--radius-node)+3px)] border border-[var(--color-primary)] opacity-30" />
			)}

			<Handle
				type="target"
				position={Position.Top}
				className="!bg-[var(--color-primary)] !border-2 !border-[var(--color-bg-card)] !w-3 !h-3 !-top-1.5"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!bg-[var(--color-primary)] !border-2 !border-[var(--color-bg-card)] !w-3 !h-3 !-bottom-1.5"
			/>

			{/* Header */}
			<div className="mb-2 flex items-center justify-between">
				<span className="text-sm font-semibold leading-5 text-[var(--color-text-heading)]">{nodeDef.key}</span>
				{prompt && (
					<span
						className={`rounded-[var(--radius-badge)] px-2 py-0.5 text-[11px] font-medium ${
							isActive
								? "bg-[var(--color-green-light)] text-[var(--color-green)]"
								: "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
						}`}
					>
						v{prompt.version} {isActive ? "active" : ""}
					</span>
				)}
			</div>

			{/* Metadata */}
			{prompt && (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5 text-[11px] leading-4 text-[var(--color-text-tertiary)]">
						<User className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
						<span className="text-[var(--color-text-secondary)]">{prompt.created_by ?? "system"}</span>
						<span className="mx-0.5 text-[var(--color-border-line)]">·</span>
						<Calendar className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
						<span className="text-[var(--color-text-secondary)]">{formatDate(prompt.created_at)}</span>
					</div>
					{prompt.note && (
						<div className="mt-1 line-clamp-1 text-[11px] italic leading-4 text-[var(--color-text-tertiary)]">
							&ldquo;{prompt.note}&rdquo;
						</div>
					)}
				</div>
			)}
		</button>
	);
}

// --- Dispatcher node ---
export function DispatcherNode({ data }: NodeProps<GraphFlowNode>) {
	const { nodeDef, prompt } = data;

	return (
		<div className="group relative min-w-[220px] max-w-[240px] rounded-[var(--radius-node)] border border-[var(--color-yellow-border)] bg-[var(--color-yellow-bg)] px-5 py-4 text-center shadow-sm transition-all duration-300 hover:shadow-lg">
			{/* Subtle glow */}
			<div className="pointer-events-none absolute inset-0 rounded-[var(--radius-node)] bg-gradient-to-br from-amber-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]" />

			<Handle
				type="target"
				position={Position.Top}
				className="!bg-[var(--color-yellow-border)] !border-2 !border-[var(--color-yellow-bg)] !w-3 !h-3 !-top-1.5"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!bg-[var(--color-yellow-border)] !border-2 !border-[var(--color-yellow-bg)] !w-3 !h-3 !-bottom-1.5"
			/>

			<div className="flex items-center justify-center">
				<span className="text-sm font-semibold leading-5 text-[var(--color-text-heading)]">{nodeDef.key}</span>
			</div>
			{prompt && (
				<div className="mt-2 flex items-center justify-center gap-1">
					<User className="h-3 w-3 text-[var(--color-text-muted)]" />
					<span className="text-[11px] text-[var(--color-text-secondary)]">
						{prompt.created_by ?? "system"}
					</span>
					<span className="mx-0.5 text-[var(--color-border-line)]">·</span>
					<span className="rounded-[var(--radius-badge)] bg-[var(--color-green-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-green)]">
						v{prompt.version} active
					</span>
				</div>
			)}
		</div>
	);
}
