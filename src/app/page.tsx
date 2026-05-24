import MonGrid from "@/components/MonGrid";
import type { Mon } from "@/lib/types";
import fs from "node:fs";
import path from "node:path";

function loadMons(): Mon[] {
	const p = path.join(process.cwd(), "src/data/mons.json");
	if (!fs.existsSync(p)) return [];
	return JSON.parse(fs.readFileSync(p, "utf-8")) as Mon[];
}

export default function Home() {
	const monsData = loadMons();
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
					{monsData.length} mons built
				</span>
			</header>
			<MonGrid mons={monsData} />
		</main>
	);
}
