"use client";

import { BaseEdge, type EdgeProps, getSmoothStepPath } from "@xyflow/react";

/**
 * Custom animated edge with smooth step path and flowing dash animation.
 * Uses CSS animation for a "data flowing" visual effect.
 */
export default function AnimatedFlowEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	label,
	labelStyle,
	labelBgStyle,
	labelBgPadding,
	labelBgBorderRadius,
}: EdgeProps) {
	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		borderRadius: 16,
	});

	return (
		<>
			{/* Background path for subtle glow */}
			<path d={edgePath} fill="none" stroke="var(--color-primary)" strokeWidth={4} strokeOpacity={0.06} />

			{/* Main edge */}
			<BaseEdge
				id={id}
				path={edgePath}
				style={{
					stroke: "var(--color-border-line)",
					strokeWidth: 1.5,
				}}
			/>

			{/* Animated dash overlay */}
			<path
				d={edgePath}
				fill="none"
				stroke="var(--color-primary)"
				strokeWidth={2}
				strokeOpacity={0.3}
				strokeDasharray="6 8"
				className="flow-edge-animated"
			/>

			{/* Edge label */}
			{label && (
				<g transform={`translate(${labelX}, ${labelY})`}>
					<rect
						x={-(String(label).length * 3.5 + (Array.isArray(labelBgPadding) ? labelBgPadding[1] : 8))}
						y={-10}
						width={String(label).length * 7 + (Array.isArray(labelBgPadding) ? labelBgPadding[1] * 2 : 16)}
						height={20}
						rx={labelBgBorderRadius ?? 4}
						fill={
							typeof labelBgStyle === "object" && labelBgStyle !== null && "fill" in labelBgStyle
								? String(labelBgStyle.fill)
								: "var(--color-bg-card)"
						}
						fillOpacity={0.95}
						stroke="var(--color-border-card)"
						strokeWidth={0.5}
					/>
					<text
						textAnchor="middle"
						dominantBaseline="central"
						style={{
							fontSize: 10,
							fontWeight: 500,
							fill: "var(--color-text-muted)",
							fontFamily: "Inter, system-ui, sans-serif",
							...(typeof labelStyle === "object" && labelStyle !== null ? labelStyle : {}),
						}}
					>
						{String(label)}
					</text>
				</g>
			)}
		</>
	);
}
