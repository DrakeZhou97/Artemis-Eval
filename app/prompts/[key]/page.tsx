"use client";

import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Save, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import MarkdownEditor from "@/components/markdown-editor";
import { fetchCreateVersion, fetchPatchVersion, fetchPrompt, fetchRollback, fetchVersions } from "@/lib/api-client";
import type { PromptRead, PromptVersionRead } from "@/lib/types";

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function PromptDetailPage() {
	const params = useParams<{ key: string }>();
	const router = useRouter();
	const promptKey = decodeURIComponent(params.key);
	const noteId = useId();

	const [prompt, setPrompt] = useState<PromptRead | null>(null);
	const [versions, setVersions] = useState<PromptVersionRead[]>([]);
	const [selectedVersion, setSelectedVersion] = useState<PromptVersionRead | null>(null);
	const [content, setContent] = useState("");
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [activating, setActivating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [promptData, versionsData] = await Promise.all([fetchPrompt(promptKey), fetchVersions(promptKey)]);
			setPrompt(promptData);
			setVersions(versionsData);
			setContent(promptData.content);
			setNote(promptData.note ?? "");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load prompt");
		} finally {
			setLoading(false);
		}
	}, [promptKey]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSave = async () => {
		if (!prompt) return;
		setSaving(true);
		setError(null);
		try {
			await fetchPatchVersion(promptKey, {
				content,
				note: note || null,
				version: selectedVersion?.version ?? null,
			});
			await fetchData();
			setSelectedVersion(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save");
		} finally {
			setSaving(false);
		}
	};

	const handleNewVersion = async () => {
		if (!prompt) return;
		setSaving(true);
		setError(null);
		try {
			const created = await fetchCreateVersion(promptKey, {
				content,
				note: note || null,
				created_by: null,
			});
			setPrompt(created);
			setSelectedVersion(null);
			// Refresh versions list
			const versionsData = await fetchVersions(promptKey);
			setVersions(versionsData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create version");
		} finally {
			setSaving(false);
		}
	};

	const handleSelectVersion = (v: PromptVersionRead) => {
		setSelectedVersion(v);
		setContent(v.content);
		setNote(v.note ?? "");
	};

	const handleActivate = async () => {
		if (!selectedVersion || selectedVersion.is_active) return;
		setActivating(true);
		setError(null);
		try {
			await fetchRollback(promptKey, { version: selectedVersion.version });
			await fetchData();
			setSelectedVersion(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to activate version");
		} finally {
			setActivating(false);
		}
	};

	// Determine what the editor is currently showing
	const viewingVersion = selectedVersion ?? prompt;
	const isViewingActive = viewingVersion?.is_active ?? true;
	const compareTarget = selectedVersion ?? prompt;
	const hasChanges =
		compareTarget !== null && (content !== compareTarget.content || note !== (compareTarget.note ?? ""));

	if (loading) {
		return (
			<div className="flex items-center justify-center py-32">
				<span className="loading loading-spinner loading-lg text-[var(--color-primary)]" />
			</div>
		);
	}

	if (error && !prompt) {
		return (
			<div className="flex flex-col items-center gap-4 p-8">
				<div className="rounded-[var(--radius-button)] border border-[var(--color-red)] bg-red-50 p-4 text-sm text-[var(--color-red)]">
					{error}
				</div>
				<Link href="/" className="text-sm font-medium text-[var(--color-primary)] no-underline hover:underline">
					Back to Dashboard
				</Link>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-6 p-8">
			{/* Back link */}
			<Link
				href="/"
				className="flex items-center gap-2 text-sm font-medium leading-5 tracking-[-0.15px] text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-heading)]"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Dashboard
			</Link>

			{/* Header */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-3">
					<FileText className="h-7 w-7 text-[var(--color-primary)]" />
					<h1 className="text-3xl font-bold leading-9 tracking-[0.4px] text-[var(--color-text-heading)]">
						{promptKey}
					</h1>
				</div>
				<p className="text-base leading-6 tracking-[-0.31px] text-[var(--color-text-secondary)]">
					Edit and manage prompt versions
				</p>
			</div>

			{/* Metadata card */}
			{viewingVersion && (
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--radius-card)] border border-[var(--color-border-card)] bg-[var(--color-bg-card)] px-5 py-4">
					<span
						className={`rounded-[var(--radius-badge)] px-2.5 py-1 text-xs font-medium ${
							viewingVersion.is_active
								? "bg-[var(--color-green-light)] text-[var(--color-green)]"
								: "bg-[var(--color-bg-badge)] text-[var(--color-text-heading)]"
						}`}
					>
						v{viewingVersion.version} {viewingVersion.is_active ? "active" : ""}
					</span>

					<span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
						<User className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
						{viewingVersion.created_by ?? "system"}
					</span>

					<span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
						<Calendar className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
						{formatDate(viewingVersion.created_at)}
					</span>

					<span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
						<Clock className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
						{formatDateTime(viewingVersion.updated_at)}
					</span>

					{viewingVersion.note && (
						<span className="basis-full text-sm italic text-[var(--color-text-tertiary)]">
							&ldquo;{viewingVersion.note}&rdquo;
						</span>
					)}
				</div>
			)}

			{/* Error */}
			{error && (
				<div className="rounded-[var(--radius-button)] border border-[var(--color-red)] bg-red-50 p-4 text-sm text-[var(--color-red)]">
					{error}
				</div>
			)}

			{/* Note input */}
			<div>
				<label htmlFor={noteId} className="mb-1.5 block text-sm font-medium text-[var(--color-text-heading)]">
					Note
				</label>
				<input
					id={noteId}
					type="text"
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="Change reason or note..."
					className="h-9 w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 text-sm text-[var(--color-text-heading)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
				/>
			</div>

			{/* Markdown Editor */}
			<MarkdownEditor value={content} onChange={setContent} disabled={saving} />

			{/* Action buttons */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={handleSave}
					disabled={saving || !hasChanges}
					className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-button)] bg-[#030213] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Save className="h-4 w-4" />
					{saving ? "Saving..." : "Save"}
				</button>
				<button
					type="button"
					onClick={handleNewVersion}
					disabled={saving}
					className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-primary)] bg-[var(--color-bg-card)] px-5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-bg)] disabled:cursor-not-allowed disabled:opacity-50"
				>
					<FileText className="h-4 w-4" />
					New Version
				</button>
				<button
					type="button"
					onClick={() => router.push("/")}
					className="flex h-10 cursor-pointer items-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-page)]"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={handleActivate}
					disabled={isViewingActive || activating}
					className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-green)] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<CheckCircle className="h-4 w-4" />
					{activating ? "Activating..." : "Activate"}
				</button>
			</div>

			{/* Version history */}
			{versions.length > 0 && (
				<div className="mt-4 rounded-[var(--radius-card)] border border-[var(--color-border-card)] bg-[var(--color-bg-card)] p-6">
					<h2 className="mb-4 text-base font-semibold text-[var(--color-text-heading)]">Version History</h2>
					<div className="flex flex-col gap-3">
						{versions.map((v) => {
							const isSelected = selectedVersion?.id === v.id;
							return (
								<button
									key={v.id}
									type="button"
									onClick={() => handleSelectVersion(v)}
									className={`flex cursor-pointer items-center justify-between rounded-[var(--radius-button)] border p-3 text-left transition-colors ${
										isSelected
											? "border-[var(--color-primary)] bg-[var(--color-primary-bg)] ring-2 ring-[var(--color-primary)]"
											: v.is_active
												? "border-[var(--color-primary)] bg-[var(--color-primary-bg)] hover:bg-[var(--color-primary-bg)]"
												: "border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-page)]"
									}`}
								>
									<div className="flex items-center gap-3">
										<span
											className={`rounded-[var(--radius-badge)] px-2 py-0.5 text-xs font-medium ${
												v.is_active
													? "bg-[var(--color-green-light)] text-[var(--color-green)]"
													: "bg-[var(--color-bg-badge)] text-[var(--color-text-heading)]"
											}`}
										>
											v{v.version}
										</span>
										<span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
											<User className="h-3 w-3" />
											{v.created_by ?? "system"}
										</span>
										<span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
											<Clock className="h-3 w-3" />
											{formatDateTime(v.created_at)}
										</span>
									</div>
									{v.note && (
										<span className="max-w-[200px] truncate text-xs italic text-[var(--color-text-tertiary)]">
											{v.note}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
