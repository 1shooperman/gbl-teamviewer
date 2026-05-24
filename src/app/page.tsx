import MonGrid from "@/components/MonGrid";
import monsData from "@/data/mons.json";
import type { Mon } from "@/lib/types";

export default function Home() {
	return (
		<main>
			<header
				style={{
					padding: "20px 20px 0",
					display: "flex",
					alignItems: "baseline",
					gap: 12,
				}}
			>
				<h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
					GBL Collection
				</h1>
				<span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
					{(monsData as Mon[]).length} mons built
				</span>
			</header>
			<MonGrid mons={monsData as Mon[]} />
		</main>
	);
}
