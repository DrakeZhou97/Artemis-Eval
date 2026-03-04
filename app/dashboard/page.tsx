import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard overview",
};

const stats = [
	{ label: "Total Users", value: "1,234", desc: "+12% from last month", variant: "text-primary" },
	{ label: "Revenue", value: "$5,678", desc: "+8% from last month", variant: "text-secondary" },
	{ label: "Active Projects", value: "42", desc: "3 completed this week", variant: "text-accent" },
] as const;

export default function DashboardPage() {
	return (
		<main className="min-h-screen bg-base-200 p-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-base-content">Dashboard</h1>
					<p className="mt-2 text-base-content/70">Overview of your application metrics.</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{stats.map((stat) => (
						<div key={stat.label} className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<h2 className="card-title text-sm font-medium text-base-content/70">{stat.label}</h2>
								<p className={`text-3xl font-bold ${stat.variant}`}>{stat.value}</p>
								<p className="text-sm text-base-content/50">{stat.desc}</p>
							</div>
						</div>
					))}
				</div>

				<div role="alert" className="alert alert-success">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="h-6 w-6 shrink-0 stroke-current"
						aria-label="Success"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>All systems operational. Last checked 2 minutes ago.</span>
				</div>

				<div className="flex justify-center">
					<a href="/" className="btn btn-ghost">
						Back to Home
					</a>
				</div>
			</div>
		</main>
	);
}
