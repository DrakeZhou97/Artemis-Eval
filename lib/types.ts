// TypeScript interfaces derived from the OpenAPI spec (CLAUDE.md Appendix A)

/** Full prompt response — returned by all read endpoints. */
export interface PromptRead {
	id: string;
	key: string;
	version: number;
	content: string;
	is_active: boolean;
	created_by: string | null;
	note: string | null;
	created_at: string; // ISO 8601 date-time
	updated_at: string; // ISO 8601 date-time
}

/** PUT body — create a new version of a prompt (append-only). */
export interface PromptCreate {
	content: string;
	created_by?: string | null;
	note?: string | null;
}

/** PATCH body — edit an existing version in-place (content/note). */
export interface PromptPatch {
	content?: string | null;
	note?: string | null;
	version?: number | null;
}

/** POST body — rollback to a specific version number. */
export interface PromptRollback {
	version: number;
}

/** Version history entry (no `key` — implied by the endpoint path). */
export interface PromptVersionRead {
	id: string;
	version: number;
	content: string;
	is_active: boolean;
	created_by: string | null;
	note: string | null;
	created_at: string; // ISO 8601 date-time
	updated_at: string; // ISO 8601 date-time
}
