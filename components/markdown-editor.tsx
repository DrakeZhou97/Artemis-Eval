"use client";

import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export default function MarkdownEditor({ value, onChange, disabled = false }: MarkdownEditorProps) {
	const [colorMode, setColorMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		setColorMode(mq.matches ? "dark" : "light");

		const handler = (e: MediaQueryListEvent) => setColorMode(e.matches ? "dark" : "light");
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return (
		<div data-color-mode={colorMode}>
			<MDEditor
				value={value}
				onChange={(val) => onChange(val ?? "")}
				height={400}
				preview="live"
				textareaProps={{
					placeholder: "Write your prompt content here...",
					disabled,
				}}
			/>
		</div>
	);
}
