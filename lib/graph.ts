// Agent execution graph definition.
// Describes the LangGraph topology so the dashboard can render the interactive graph.

export interface GraphNodeDef {
	key: string;
	type: "start" | "end" | "agent" | "dispatcher";
}

export interface GraphEdgeDef {
	from: string;
	to: string;
	label?: string;
}

/** Layer = a row in the graph visualisation (nodes rendered side-by-side). */
export type GraphLayer = string[];

/**
 * Static definition of the agent execution graph.
 * Matches the mermaid diagram in CLAUDE.md + query_agent alongside stage_dispatcher.
 */
export const GRAPH_NODES: GraphNodeDef[] = [
	{ key: "START", type: "start" },
	{ key: "user_admittance", type: "agent" },
	{ key: "intention_detection", type: "agent" },
	{ key: "stage_dispatcher", type: "dispatcher" },
	{ key: "query_agent", type: "agent" },
	{ key: "planner", type: "agent" },
	{ key: "tlc_agent", type: "agent" },
	{ key: "cc_agent", type: "agent" },
	{ key: "re_agent", type: "agent" },
	{ key: "END", type: "end" },
];

export const GRAPH_EDGES: GraphEdgeDef[] = [
	{ from: "START", to: "user_admittance" },
	{ from: "START", to: "intention_detection" },
	{ from: "user_admittance", to: "stage_dispatcher" },
	{ from: "intention_detection", to: "stage_dispatcher" },
	{ from: "stage_dispatcher", to: "planner", label: "execution" },
	{ from: "stage_dispatcher", to: "query_agent", label: "query" },
	{ from: "planner", to: "tlc_agent" },
	{ from: "planner", to: "cc_agent" },
	{ from: "planner", to: "re_agent" },
	{ from: "query_agent", to: "END" },
	{ from: "tlc_agent", to: "END" },
	{ from: "cc_agent", to: "END" },
	{ from: "re_agent", to: "END" },
];

/** Layers define the visual rows from top to bottom. */
export const GRAPH_LAYERS: GraphLayer[] = [
	["START"],
	["user_admittance", "intention_detection"],
	["stage_dispatcher"],
	["planner", "query_agent"],
	["tlc_agent", "cc_agent", "re_agent"],
	["END"],
];
