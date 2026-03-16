import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: LucideIcon;
	iconBg: string;
	iconColor: string;
}

export default function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
	return (
		<div className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-border-card)] bg-[var(--color-bg-card)] p-6">
			<div>
				<div className="text-sm leading-5 tracking-[-0.15px] text-[var(--color-text-secondary)]">{label}</div>
				<div className="text-3xl font-bold leading-9 tracking-[0.4px] text-[var(--color-text-heading)]">
					{value}
				</div>
			</div>
			<div
				className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sidebar-item)]"
				style={{ background: iconBg, color: iconColor }}
			>
				<Icon className="h-6 w-6" />
			</div>
		</div>
	);
}
