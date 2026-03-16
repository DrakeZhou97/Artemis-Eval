"use client";

import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import PromptCard from "@/components/prompt-card";
import { fetchPrompts } from "@/lib/api-client";
import type { PromptRead } from "@/lib/types";

export default function ActivatePage() {
	const [prompts, setPrompts] = useState<PromptRead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadPrompts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPrompts();
			setPrompts(data.filter((p) => p.is_active));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load prompts");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPrompts();
	}, [loadPrompts]);

	return (
		<div className="flex w-full flex-col gap-6 p-6 md:p-8 lg:px-16">
			{/* Back link */}
			<Link
				href="/"
				className="flex items-center gap-2 text-sm font-medium leading-5 tracking-[-0.15px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-heading)]"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Dashboard
			</Link>

			{/* Header */}
			<div>
				<div className="mb-1 flex items-center gap-3">
					<CheckCircle className="h-7 w-7 text-[var(--color-primary)]" />
					<h1 className="text-3xl font-bold leading-9 tracking-[0.4px] text-[var(--color-text-heading)]">
						Active Prompts
					</h1>
				</div>
				<p className="text-base leading-6 tracking-[-0.31px] text-[var(--color-text-secondary)]">
					All currently activated prompt versions across your agent nodes
				</p>
			</div>

			{/* Error */}
			{error && (
				<div className="rounded-[var(--radius-button)] border border-[var(--color-red)] bg-red-50 p-4 text-sm text-[var(--color-red)]">
					{error}
				</div>
			)}

			{/* Cards */}
			{loading ? (
				<div className="flex items-center justify-center py-16">
					<span className="loading loading-spinner loading-lg text-[var(--color-primary)]" />
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{prompts.map((prompt) => (
						<PromptCard key={prompt.id} prompt={prompt} />
					))}
					{prompts.length === 0 && (
						<p className="col-span-2 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
							No active prompts found
						</p>
					)}
				</div>
			)}
		</div>
	);
}
