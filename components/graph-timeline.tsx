"use client";

import { GRAPH_EDGES, GRAPH_LAYERS, GRAPH_NODES } from "@/lib/graph";
import type { PromptRead } from "@/lib/types";
import GraphNodeCard from "./graph-node";

interface GraphTimelineProps {
	prompts: PromptRead[];
}

export default function GraphTimeline({ prompts }: GraphTimelineProps) {
	const promptMap = new Map<string, PromptRead>();
	for (const p of prompts) {
		promptMap.set(p.key, p);
	}

	return (
		<div className="rounded-[var(--radius-card)] border border-[var(--color-border-card)] bg-[var(--color-bg-card)] p-6">
			<h2 className="mb-1 text-base font-semibold leading-6 text-[var(--color-text-heading)]">
				Agent Execution Graph
			</h2>
			<p className="mb-6 text-[13px] leading-5 text-[var(--color-text-secondary)]">
				Click any node to view and edit its prompt details
			</p>

			<div className="flex flex-col items-center gap-0 py-4">
				{GRAPH_LAYERS.map((layer, layerIdx) => {
					const isLast = layerIdx === GRAPH_LAYERS.length - 1;
					return (
						<div key={layer.join("-")} className="w-full">
							{/* Connector from previous layer */}
							{layerIdx > 0 && <LayerConnector fromLayer={GRAPH_LAYERS[layerIdx - 1]} toLayer={layer} />}

							{/* Node layer */}
							<div className="flex w-full items-start justify-center gap-5">
								{layer.map((key) => {
									const nodeDef = GRAPH_NODES.find((n) => n.key === key);
									if (!nodeDef) return null;
									return <GraphNodeCard key={key} node={nodeDef} prompt={promptMap.get(key)} />;
								})}
							</div>

							{/* Bottom spacing except for last layer */}
							{!isLast && <div className="h-0" />}
						</div>
					);
				})}
			</div>
		</div>
	);
}

/**
 * Renders SVG connector lines between graph layers.
 * Handles 1:1, 1:N (fork), and N:1 (join) topologies.
 */
function LayerConnector({ fromLayer, toLayer }: { fromLayer: string[]; toLayer: string[] }) {
	const edges = GRAPH_EDGES.filter((e) => fromLayer.includes(e.from) && toLayer.includes(e.to));
	if (edges.length === 0) return null;

	const label = edges.find((e) => e.label)?.label;
	const fromCount = fromLayer.length;
	const toCount = toLayer.length;

	// Simple 1:1 vertical line
	if (fromCount === 1 && toCount === 1) {
		return (
			<div className="relative flex justify-center py-2">
				<div className="h-8 w-0.5 bg-[var(--color-border-line)]" />
				{label && <ConnectorLabel text={label} />}
			</div>
		);
	}

	// 1:N fork -- one source splits to multiple targets
	if (fromCount === 1 && toCount > 1) {
		return (
			<div className="relative py-2">
				<svg
					className="mx-auto block h-10 w-full max-w-[700px]"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label="Fork connector"
				>
					<ForkLines count={toCount} direction="down" />
				</svg>
				{label && <ConnectorLabel text={label} />}
			</div>
		);
	}

	// N:1 join -- multiple sources merge to one target
	if (fromCount > 1 && toCount === 1) {
		return (
			<div className="relative py-2">
				<svg
					className="mx-auto block h-10 w-full max-w-[700px]"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label="Join connector"
				>
					<ForkLines count={fromCount} direction="up" />
				</svg>
				{label && <ConnectorLabel text={label} />}
			</div>
		);
	}

	// Fallback: simple vertical line
	return (
		<div className="relative flex justify-center py-2">
			<div className="h-8 w-0.5 bg-[var(--color-border-line)]" />
			{label && <ConnectorLabel text={label} />}
		</div>
	);
}

function ConnectorLabel({ text }: { text: string }) {
	return (
		<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--color-bg-card)] px-1.5 text-[10px] font-medium text-[var(--color-text-muted)]">
			{text}
		</span>
	);
}

/**
 * SVG fork/join lines.
 * direction="down": center top -> spread to N points at bottom
 * direction="up": N points at top -> converge to center bottom
 */
function ForkLines({ count, direction }: { count: number; direction: "up" | "down" }) {
	// Evenly space endpoints across the SVG width
	const positions = Array.from({ length: count }, (_, i) => {
		if (count === 1) return 50;
		return 15 + (i * 70) / (count - 1);
	});

	const strokeColor = "var(--color-border-line)";

	if (direction === "down") {
		// From center top to each endpoint bottom
		return (
			<>
				{positions.map((x) => (
					<line
						key={`fork-${x}`}
						x1="50%"
						y1="0"
						x2={`${x}%`}
						y2="100%"
						stroke={strokeColor}
						strokeWidth="1.5"
					/>
				))}
			</>
		);
	}

	// direction="up": from each endpoint top to center bottom
	return (
		<>
			{positions.map((x) => (
				<line key={`join-${x}`} x1={`${x}%`} y1="0" x2="50%" y2="100%" stroke={strokeColor} strokeWidth="1.5" />
			))}
		</>
	);
}
