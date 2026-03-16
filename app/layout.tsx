import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import EnvProvider from "@/components/env-provider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Artemis - Observe and Evaluation",
	description: "Agent Prompt Management Platform for Autonomous Lab",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={inter.variable}>
			<body className={`${inter.className} antialiased`}>
				<EnvProvider>
					<AppShell>{children}</AppShell>
				</EnvProvider>
			</body>
		</html>
	);
}
