import DarkModeAlert from "@/components/dark-mode-alert";
import GettingStartedCard from "@/components/getting-started-card";
import Hero from "@/components/hero";
import TechBadges from "@/components/tech-badges";
import TechStackTable from "@/components/tech-stack-table";

export default function Home() {
	return (
		<main className="min-h-screen bg-base-200 p-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<Hero />
				<TechBadges />
				<div className="divider" />
				<GettingStartedCard />
				<DarkModeAlert />
				<TechStackTable />
			</div>
		</main>
	);
}
