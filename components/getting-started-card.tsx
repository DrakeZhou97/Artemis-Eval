const docLinks = [
	{ href: "https://nextjs.org/docs", label: "Next.js Docs", variant: "btn-primary" },
	{ href: "https://daisyui.com", label: "DaisyUI Docs", variant: "btn-secondary" },
	{ href: "https://tailwindcss.com/docs", label: "Tailwind Docs", variant: "btn-accent" },
] as const;

export default function GettingStartedCard() {
	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">Getting Started</h2>
				<p>
					Edit <code className="rounded bg-base-300 px-1.5 py-0.5">app/page.tsx</code> to start building your
					application.
				</p>
				<div className="card-actions mt-4 justify-end">
					{docLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className={`btn ${link.variant}`}
						>
							{link.label}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
