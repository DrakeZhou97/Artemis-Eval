// Client-side API functions.
// Paths match the backend OpenAPI spec directly (/prompts/*).
// Next.js rewrites proxy these to the backend.

import type { PromptCreate, PromptPatch, PromptRead, PromptRollback, PromptVersionRead } from "./types";

/** List all prompts (active versions). */
export async function fetchPrompts(): Promise<PromptRead[]> {
	const res = await fetch("/api/prompts");
	if (!res.ok) throw new Error(`Failed to list prompts: ${res.status}`);
	return res.json();
}

/** Get the active prompt for a key. */
export async function fetchPrompt(key: string): Promise<PromptRead> {
	const res = await fetch(`/api/prompts/${encodeURIComponent(key)}`);
	if (!res.ok) throw new Error(`Failed to get prompt "${key}": ${res.status}`);
	return res.json();
}

/** Create a new version of a prompt. */
export async function fetchCreateVersion(key: string, data: PromptCreate): Promise<PromptRead> {
	const res = await fetch(`/api/prompts/${encodeURIComponent(key)}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to create version for "${key}": ${res.status}`);
	return res.json();
}

/** Edit an existing version in-place. */
export async function fetchPatchVersion(key: string, data: PromptPatch): Promise<PromptRead> {
	const res = await fetch(`/api/prompts/${encodeURIComponent(key)}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to patch version for "${key}": ${res.status}`);
	return res.json();
}

/** List all versions of a prompt. */
export async function fetchVersions(key: string): Promise<PromptVersionRead[]> {
	const res = await fetch(`/api/prompts/${encodeURIComponent(key)}/versions`);
	if (!res.ok) throw new Error(`Failed to list versions for "${key}": ${res.status}`);
	return res.json();
}

/** Rollback to a specific version. */
export async function fetchRollback(key: string, data: PromptRollback): Promise<PromptRead> {
	const res = await fetch(`/api/prompts/${encodeURIComponent(key)}/rollback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to rollback "${key}": ${res.status}`);
	return res.json();
}
