"use client";

import { Calendar, User } from "lucide-react";
import Link from "next/link";
import type { GraphNodeDef } from "@/lib/graph";
import type { PromptRead } from "@/lib/types";

interface GraphNodeProps {
	node: GraphNodeDef;
	prompt?: PromptRead;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function GraphNodeCard({ node, prompt }: GraphNodeProps) {
	// START / END nodes -- simple pills
	if (node.type === "start" || node.type === "end") {
		return (
			<div className="flex min-w-[100px] max-w-[100px] items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-text-heading)] px-4 py-2.5">
				<span className="text-[13px] font-semibold text-white">{node.key}</span>
			</div>
		);
	}

	// Dispatcher node -- yellow accent
	if (node.type === "dispatcher") {
		return (
			<div className="min-w-[200px] max-w-[240px] rounded-[var(--radius-node)] border border-[var(--color-yellow-border)] bg-[var(--color-yellow-bg)] px-5 py-4 text-center">
				<div className="flex items-center justify-center">
					<span className="text-sm font-semibold leading-5 text-[var(--color-text-heading)]">{node.key}</span>
				</div>
				{prompt && (
					<div className="mt-2 flex items-center justify-center gap-1">
						<User className="h-3 w-3 text-[var(--color-text-muted)]" />
						<span className="text-[11px] text-[var(--color-text-secondary)]">
							{prompt.created_by ?? "system"}
						</span>
						<span className="mx-0.5 text-[var(--color-border-line)]">.</span>
						<span className="rounded-[var(--radius-badge)] bg-[var(--color-green-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-green)]">
							v{prompt.version} active
						</span>
					</div>
				)}
			</div>
		);
	}

	// Agent node -- white card with optional active border
	const isActive = prompt?.is_active ?? false;
	const nodeContent = (
		<div
			className={`min-w-[220px] max-w-[280px] cursor-pointer rounded-[var(--radius-node)] border bg-[var(--color-bg-card)] px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
				isActive
					? "border-2 border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(130,0,219,0.1)]"
					: "border-[var(--color-border-card)]"
			}`}
		>
			<div className="mb-2 flex items-center justify-between">
				<span className="text-sm font-semibold leading-5 text-[var(--color-text-heading)]">{node.key}</span>
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
			{prompt && (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5 text-[11px] leading-4 text-[var(--color-text-tertiary)]">
						<User className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
						<span className="text-[var(--color-text-secondary)]">{prompt.created_by ?? "system"}</span>
						<span className="mx-0.5 text-[var(--color-border-line)]">.</span>
						<Calendar className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
						<span className="text-[var(--color-text-secondary)]">{formatDate(prompt.created_at)}</span>
					</div>
					{prompt.note && (
						<div className="mt-1.5 line-clamp-1 text-[11px] italic leading-4 text-[var(--color-text-tertiary)]">
							&ldquo;{prompt.note}&rdquo;
						</div>
					)}
				</div>
			)}
		</div>
	);

	// Wrap agent nodes in a link to the prompt detail page
	if (prompt) {
		return (
			<Link href={`/prompts/${encodeURIComponent(node.key)}`} className="no-underline">
				{nodeContent}
			</Link>
		);
	}

	return nodeContent;
}
