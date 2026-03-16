"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function SearchBar({
	value,
	onChange,
	placeholder = "Search by title, key, note, or tags...",
}: SearchBarProps) {
	return (
		<div className="relative">
			<Search className="absolute left-3 top-2 h-5 w-5 text-[var(--color-text-placeholder)]" />
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="h-9 w-full rounded-[var(--radius-button)] border border-transparent bg-[var(--color-bg-input)] py-1 pl-10 pr-3 text-sm tracking-[-0.15px] text-[var(--color-text-heading)] outline-none placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
			/>
		</div>
	);
}
