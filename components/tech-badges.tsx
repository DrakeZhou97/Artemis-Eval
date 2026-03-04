const badges = [
	{ label: "Next.js 16", variant: "badge-primary" },
	{ label: "React 19", variant: "badge-secondary" },
	{ label: "TailwindCSS v4", variant: "badge-accent" },
	{ label: "DaisyUI v5", variant: "badge-info" },
	{ label: "Biome", variant: "badge-warning" },
	{ label: "Bun", variant: "badge-success" },
] as const;

export default function TechBadges() {
	return (
		<div className="flex flex-wrap justify-center gap-2">
			{badges.map((badge) => (
				<span key={badge.label} className={`badge ${badge.variant}`}>
					{badge.label}
				</span>
			))}
		</div>
	);
}
