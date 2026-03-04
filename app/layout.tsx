import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Next.js Boilerplate",
	description: "Next.js 16 + Bun + TailwindCSS v4 + DaisyUI v5 + Biome",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
