"use client";

import {
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	BackgroundVariant,
	Controls,
	type EdgeChange,
	MiniMap,
	type NodeChange,
	ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";
import AnimatedFlowEdge from "@/components/flow-edge";
import { AgentNode, DispatcherNode, EndNode, StartNode } from "@/components/flow-nodes";
import { buildFlowEdges, buildFlowNodes } from "@/lib/graph-layout";
import type { PromptRead } from "@/lib/types";

// Register custom node types (defined outside component to prevent re-renders)
const nodeTypes = {
	"graph-start": StartNode,
	"graph-end": EndNode,
	"graph-agent": AgentNode,
	"graph-dispatcher": DispatcherNode,
};

// Register custom edge types
const edgeTypes = {
	"animated-flow": AnimatedFlowEdge,
};

// MiniMap node color by type
function miniMapNodeColor(node: { type?: string }): string {
	switch (node.type) {
		case "graph-start":
		case "graph-end":
			return "#101828";
		case "graph-dispatcher":
			return "#fcd34d";
		case "graph-agent":
			return "#8200db";
		default:
			return "#e5e7eb";
	}
}

interface GraphFlowProps {
	prompts: PromptRead[];
}

export default function GraphFlow({ prompts }: GraphFlowProps) {
	const promptMap = useMemo(() => {
		const map = new Map<string, PromptRead>();
		for (const p of prompts) {
			map.set(p.key, p);
		}
		return map;
	}, [prompts]);

	const initialNodes = useMemo(() => buildFlowNodes(promptMap), [promptMap]);
	const initialEdges = useMemo(() => buildFlowEdges(), []);

	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as typeof nds),
		[],
	);

	const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

	return (
		<div className="rounded-[var(--radius-card)] border border-[var(--color-border-card)] bg-[var(--color-bg-card)] p-6">
			<h2 className="mb-1 text-base font-semibold leading-6 text-[var(--color-text-heading)]">
				Agent Execution Graph
			</h2>
			<p className="mb-4 text-[13px] leading-5 text-[var(--color-text-secondary)]">
				Click any node to view and edit its prompt. Drag to rearrange, scroll to zoom.
			</p>

			<div className="h-[620px] w-full overflow-hidden rounded-[var(--radius-node)] border border-[var(--color-border-card)] bg-[var(--color-bg-page)]">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					fitView
					fitViewOptions={{ padding: 0.15 }}
					minZoom={0.3}
					maxZoom={2}
					attributionPosition="bottom-left"
					proOptions={{ hideAttribution: true }}
				>
					<Background
						variant={BackgroundVariant.Dots}
						gap={20}
						size={1}
						color="var(--color-border-line)"
						style={{ opacity: 0.3 }}
					/>
					<Controls
						showInteractive={false}
						className="!rounded-[var(--radius-button)] !border-[var(--color-border-card)] !bg-[var(--color-bg-card)] !shadow-md [&>button]:!border-[var(--color-border-card)] [&>button]:!bg-[var(--color-bg-card)] [&>button]:hover:!bg-[var(--color-bg-input)]"
					/>
					<MiniMap
						nodeColor={miniMapNodeColor}
						nodeStrokeWidth={1}
						pannable
						zoomable
						className="!rounded-[var(--radius-button)] !border-[var(--color-border-card)] !bg-[var(--color-bg-card)] !shadow-md"
						maskColor="rgba(0, 0, 0, 0.08)"
					/>
				</ReactFlow>
			</div>
		</div>
	);
}
