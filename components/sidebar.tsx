"use client";

import { CheckCircle, FileText, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
	{ href: "/", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/activate", label: "Activated", icon: CheckCircle },
] as const;

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="flex h-full w-52 min-w-52 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-card)]">
			{/* Header */}
			<div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-border)] px-4">
				<div
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sidebar-item)]"
					style={{ background: "var(--gradient-brand)" }}
				>
					<FileText className="h-5 w-5 text-white" />
				</div>
				<div>
					<h1 className="text-lg font-semibold leading-7 tracking-[0.07px] text-[var(--color-text-heading)]">
						Artemis
					</h1>
					<p className="text-[11px] leading-4 text-[var(--color-text-tertiary)]">Observe and Evaluation</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex flex-1 flex-col gap-1 p-3">
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-2.5 rounded-[var(--radius-sidebar-item)] px-3 py-2.5 text-sm font-medium leading-5 tracking-[-0.31px] no-underline transition-colors ${
								isActive
									? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
									: "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-page)]"
							}`}
						>
							<item.icon className="h-5 w-5 shrink-0" />
							{item.label}
						</Link>
					);
				})}
			</nav>

		</aside>
	);
}
