"use client";

import { Circle, FileText, GitBranch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import GraphFlow from "@/components/graph-flow";
import SearchBar from "@/components/search-bar";
import StatCard from "@/components/stat-card";
import { fetchPrompts, fetchVersions } from "@/lib/api-client";
import { getEnvConfig } from "@/lib/env";
import type { PromptRead } from "@/lib/types";
import { useEnv } from "@/lib/use-env";

export default function DashboardPage() {
	const { env } = useEnv();
	const [prompts, setPrompts] = useState<PromptRead[]>([]);
	const [search, setSearch] = useState("");
	const [totalVersions, setTotalVersions] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadPrompts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPrompts();
			setPrompts(data);

			// Fetch actual version counts per unique key
			const uniqueKeys = [...new Set(data.map((p) => p.key))];
			const versionLists = await Promise.all(uniqueKeys.map((key) => fetchVersions(key)));
			setTotalVersions(versionLists.reduce((sum, versions) => sum + versions.length, 0));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load prompts");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPrompts();
	}, [loadPrompts]);

	const envConfig = getEnvConfig(env);

	// Compute stats
	const activeNodes = prompts.filter((p) => p.is_active).length;

	// Filter prompts by search
	const filteredPrompts = search
		? prompts.filter(
				(p) =>
					p.key.toLowerCase().includes(search.toLowerCase()) ||
					(p.note?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
					p.content.toLowerCase().includes(search.toLowerCase()),
			)
		: prompts;

	return (
		<div className="flex w-full flex-col gap-8 p-8">
			{/* Page header */}
			<div>
				<div className="mb-2 flex items-center gap-3">
					<GitBranch className="h-8 w-8 text-[var(--color-primary)]" />
					<h1 className="text-3xl font-bold leading-9 tracking-[0.4px] text-[var(--color-text-heading)]">
						Agent Graph Timeline
					</h1>
				</div>
				<p className="mb-3 text-base leading-6 tracking-[-0.31px] text-[var(--color-text-secondary)]">
					Visualize your LangGraph agent prompts and their version history
				</p>
				<span className="inline-flex items-center rounded-[var(--radius-button)] bg-[var(--color-bg-badge)] px-2.5 py-1 text-xs font-medium leading-4 text-[var(--color-text-heading)]">
					{envConfig.label.toUpperCase()} Environment
				</span>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<StatCard
					label="Active Nodes"
					value={loading ? "--" : activeNodes}
					icon={GitBranch}
					iconBg="var(--color-primary-light)"
					iconColor="var(--color-primary)"
				/>
				<StatCard
					label="Total Versions"
					value={loading ? "--" : totalVersions}
					icon={FileText}
					iconBg="var(--color-blue-light)"
					iconColor="var(--color-blue)"
				/>
				<StatCard
					label="Environment"
					value={envConfig.label}
					icon={Circle}
					iconBg={
						envConfig.label === "Production"
							? "var(--color-green-light, #dcfce7)"
							: "var(--color-orange-light, #ffedd5)"
					}
					iconColor={
						envConfig.label === "Production"
							? "var(--color-green, #16a34a)"
							: "var(--color-orange, #ea580c)"
					}
				/>
			</div>

			{/* Search */}
			<SearchBar value={search} onChange={setSearch} />

			{/* Graph Timeline */}
			{error && (
				<div className="rounded-[var(--radius-button)] border border-[var(--color-red)] bg-red-50 p-4 text-sm text-[var(--color-red)]">
					{error}
				</div>
			)}
			{loading ? (
				<div className="flex items-center justify-center py-16">
					<span className="loading loading-spinner loading-lg text-[var(--color-primary)]" />
				</div>
			) : (
				<GraphFlow prompts={filteredPrompts} />
			)}
		</div>
	);
}
