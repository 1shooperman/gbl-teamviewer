"use client";
import { useMemo, useState } from "react";
import type { Mon } from "@/lib/types";
import styles from "./MonGrid.module.css";
import PokemonCard from "./PokemonCard";

type SortKey = "rank" | "cp" | "name";

export default function MonGrid({ mons }: { mons: Mon[] }) {
	const [search, setSearch] = useState("");
	const [shadow, setShadow] = useState<"all" | "yes" | "no">("all");
	const [legacy, setLegacy] = useState(false);
	const [incomplete, setIncomplete] = useState(false);
	const [typeFilter, setTypeFilter] = useState("all");
	const [sort, setSort] = useState<SortKey>("rank");

	const allTypes = useMemo(() => {
		const s = new Set<string>();
		for (const m of mons) for (const t of m.types) s.add(t);
		return ["all", ...Array.from(s).sort()];
	}, [mons]);

	const filtered = useMemo(() => {
		const idQuery = search.startsWith("#")
			? search.slice(1)
			: /^\d+$/.test(search)
				? search
				: null;
		let result = mons.filter((m) => {
			if (search) {
				if (idQuery !== null) {
					if (m.id.toString() !== idQuery) return false;
				} else if (!m.species.toLowerCase().includes(search.toLowerCase())) {
					return false;
				}
			}
			if (shadow === "yes" && !m.shadow) return false;
			if (shadow === "no" && m.shadow) return false;
			if (legacy && !m.legacyMove) return false;
			if (
				incomplete &&
				m.types.length > 0 &&
				m.fastMove &&
				m.chargeMove1 &&
				m.glRank != null
			)
				return false;
			if (typeFilter !== "all" && !m.types.includes(typeFilter)) return false;
			return true;
		});

		result = [...result].sort((a, b) => {
			if (sort === "rank") {
				if (a.glRank == null && b.glRank == null) return 0;
				if (a.glRank == null) return 1;
				if (b.glRank == null) return -1;
				return a.glRank - b.glRank;
			}
			if (sort === "cp") return (b.cp ?? 0) - (a.cp ?? 0);
			return a.species.localeCompare(b.species);
		});

		return result;
	}, [mons, search, shadow, legacy, incomplete, typeFilter, sort]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.controls}>
				<input
					className={styles.search}
					placeholder="Search Pokémon…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<select
					className={styles.select}
					value={shadow}
					onChange={(e) => setShadow(e.target.value as typeof shadow)}
				>
					<option value="all">All</option>
					<option value="yes">Shadow only</option>
					<option value="no">Non-shadow</option>
				</select>

				<select
					className={styles.select}
					value={typeFilter}
					onChange={(e) => setTypeFilter(e.target.value)}
				>
					{allTypes.map((t) => (
						<option key={t} value={t}>
							{t === "all" ? "All types" : t}
						</option>
					))}
				</select>

				<select
					className={styles.select}
					value={sort}
					onChange={(e) => setSort(e.target.value as SortKey)}
				>
					<option value="rank">Sort: GL Rank</option>
					<option value="cp">Sort: CP</option>
					<option value="name">Sort: Name</option>
				</select>

				<label className={styles.check}>
					<input
						type="checkbox"
						checked={legacy}
						onChange={(e) => setLegacy(e.target.checked)}
					/>
					Legacy only
				</label>

				<label className={styles.check}>
					<input
						type="checkbox"
						checked={incomplete}
						onChange={(e) => setIncomplete(e.target.checked)}
					/>
					Incomplete
				</label>

				<span className={styles.count}>
					{filtered.length} / {mons.length}
				</span>
			</div>

			<div className={styles.grid}>
				{filtered.map((mon) => (
					<PokemonCard key={mon.id} mon={mon} />
				))}
			</div>
		</div>
	);
}
