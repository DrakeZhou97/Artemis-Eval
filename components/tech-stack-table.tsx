const techStack = [
	{ name: "Bun", role: "Package manager & runtime" },
	{ name: "Next.js 16", role: "SSR framework (App Router, Turbopack)" },
	{ name: "React 19", role: "UI library" },
	{ name: "TypeScript 5", role: "Type safety (strict mode)" },
	{ name: "TailwindCSS v4", role: "Utility-first CSS" },
	{ name: "DaisyUI v5", role: "Component library" },
	{ name: "Biome", role: "Linter + Formatter" },
] as const;

export default function TechStackTable() {
	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">Tech Stack</h2>
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>Component</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							{techStack.map((tech) => (
								<tr key={tech.name}>
									<td className="font-medium">{tech.name}</td>
									<td>{tech.role}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
