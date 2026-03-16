"use client";

import { Calendar, CheckCircle, Edit3 } from "lucide-react";
import Link from "next/link";
import type { PromptRead } from "@/lib/types";

interface PromptCardProps {
	prompt: PromptRead;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function PromptCard({ prompt }: PromptCardProps) {
	return (
		<div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border-card)] bg-[var(--color-bg-card)] p-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<h3 className="text-lg font-semibold leading-7 tracking-[-0.44px] text-[var(--color-text-heading)]">
					{prompt.key}
				</h3>
				{prompt.is_active && <CheckCircle className="h-5 w-5 shrink-0 text-[var(--color-green)]" />}
			</div>

			{/* Badges */}
			<div className="flex items-center gap-2">
				<span className="rounded-[var(--radius-badge)] bg-[var(--color-bg-badge)] px-2 py-0.5 text-xs font-medium leading-4 text-[var(--color-text-heading)]">
					v{prompt.version} {prompt.is_active ? "active" : ""}
				</span>
				<span className="flex items-center gap-1 text-xs leading-4 text-[var(--color-text-tertiary)]">
					<Calendar className="h-3 w-3 text-[var(--color-text-muted)]" />
					{formatDate(prompt.created_at)}
				</span>
			</div>

			{/* Content preview */}
			<p className="line-clamp-3 text-sm leading-5 tracking-[-0.15px] text-[var(--color-text-secondary)]">
				{prompt.content}
			</p>

			{/* Footer */}
			<div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-3">
				<Link
					href={`/prompts/${encodeURIComponent(prompt.key)}`}
					className="flex h-9 flex-1 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-bg-card)] text-sm font-medium leading-5 tracking-[-0.15px] text-[var(--color-text-primary)] no-underline transition-colors hover:bg-[var(--color-bg-page)]"
				>
					View Details
				</Link>
				<Link
					href={`/prompts/${encodeURIComponent(prompt.key)}`}
					className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] no-underline transition-colors hover:bg-[var(--color-bg-page)]"
				>
					<Edit3 className="h-4 w-4" />
				</Link>
			</div>
		</div>
	);
}
