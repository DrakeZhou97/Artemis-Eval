// Converts static graph definitions into React Flow nodes and edges with auto-layout positions.

import type { Edge, Node } from "@xyflow/react";
import { GRAPH_EDGES, GRAPH_LAYERS, GRAPH_NODES, type GraphNodeDef } from "./graph";
import type { PromptRead } from "./types";

/** Custom data payload for graph nodes. */
export interface FlowNodeData extends Record<string, unknown> {
	nodeDef: GraphNodeDef;
	prompt?: PromptRead;
}

/** Typed Node used across the graph. */
export type GraphFlowNode = Node<FlowNodeData>;

/** Node dimensions by type */
const NODE_SIZES: Record<GraphNodeDef["type"], { width: number; height: number }> = {
	start: { width: 100, height: 40 },
	end: { width: 100, height: 40 },
	agent: { width: 260, height: 120 },
	dispatcher: { width: 220, height: 80 },
};

/** Vertical gap between layers */
const LAYER_GAP_Y = 80;
/** Horizontal gap between nodes in same layer */
const NODE_GAP_X = 30;

/**
 * Build React Flow nodes with positions calculated from the layer-based layout.
 * Centers each layer horizontally.
 */
export function buildFlowNodes(promptMap: Map<string, PromptRead>): GraphFlowNode[] {
	const nodes: GraphFlowNode[] = [];
	let currentY = 0;

	// Calculate the maximum layer width to center all layers
	let maxLayerWidth = 0;
	for (const layer of GRAPH_LAYERS) {
		let layerWidth = 0;
		for (const key of layer) {
			const nodeDef = GRAPH_NODES.find((n) => n.key === key);
			if (!nodeDef) continue;
			layerWidth += NODE_SIZES[nodeDef.type].width;
		}
		layerWidth += (layer.length - 1) * NODE_GAP_X;
		if (layerWidth > maxLayerWidth) maxLayerWidth = layerWidth;
	}

	for (const layer of GRAPH_LAYERS) {
		// Calculate total width of this layer
		let totalWidth = 0;
		const layerNodes: { key: string; def: GraphNodeDef; size: { width: number; height: number } }[] = [];

		for (const key of layer) {
			const nodeDef = GRAPH_NODES.find((n) => n.key === key);
			if (!nodeDef) continue;
			const size = NODE_SIZES[nodeDef.type];
			layerNodes.push({ key, def: nodeDef, size });
			totalWidth += size.width;
		}
		totalWidth += (layerNodes.length - 1) * NODE_GAP_X;

		// Center the layer
		let startX = (maxLayerWidth - totalWidth) / 2;

		// Find tallest node in layer for vertical centering
		const maxHeight = Math.max(...layerNodes.map((n) => n.size.height));

		for (const { key, def, size } of layerNodes) {
			const yOffset = (maxHeight - size.height) / 2;
			nodes.push({
				id: key,
				type: `graph-${def.type}`,
				position: { x: startX, y: currentY + yOffset },
				data: {
					nodeDef: def,
					prompt: promptMap.get(key),
				},
				draggable: true,
			});
			startX += size.width + NODE_GAP_X;
		}

		currentY += maxHeight + LAYER_GAP_Y;
	}

	return nodes;
}

/**
 * Build React Flow edges from the static graph definition.
 */
export function buildFlowEdges(): Edge[] {
	return GRAPH_EDGES.map((edge) => ({
		id: `${edge.from}->${edge.to}`,
		source: edge.from,
		target: edge.to,
		type: "animated-flow",
		animated: true,
		label: edge.label,
		style: { stroke: "var(--color-border-line)" },
		labelStyle: {
			fontSize: 10,
			fontWeight: 500,
			fill: "var(--color-text-muted)",
		},
		labelBgStyle: {
			fill: "var(--color-bg-card)",
			fillOpacity: 0.9,
		},
		labelBgPadding: [4, 8] as [number, number],
		labelBgBorderRadius: 4,
	}));
}
