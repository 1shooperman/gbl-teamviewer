import { describe, expect, it } from "vitest";
import type { Mon } from "@/lib/types";

// Mirror the filter + sort logic from MonGrid so we can unit-test it in isolation.
function filterAndSort(
	mons: Mon[],
	opts: {
		search?: string;
		shadow?: "all" | "yes" | "no";
		legacy?: boolean;
		incomplete?: boolean;
		typeFilter?: string;
		sort?: "rank" | "cp" | "name";
	},
): Mon[] {
	const {
		search = "",
		shadow = "all",
		legacy = false,
		incomplete = false,
		typeFilter = "all",
		sort = "rank",
	} = opts;

	const terms = search
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	const matchesTerm = (m: Mon, term: string) => {
		const idQuery = term.startsWith("#")
			? term.slice(1)
			: /^\d+$/.test(term)
				? term
				: null;
		if (idQuery !== null) return m.id.toString() === idQuery;
		return m.species.toLowerCase().includes(term.toLowerCase());
	};

	const result = mons.filter((m) => {
		if (terms.length > 0 && !terms.some((t) => matchesTerm(m, t)))
			return false;
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

	return [...result].sort((a, b) => {
		if (sort === "rank") {
			if (a.glRank == null && b.glRank == null) return 0;
			if (a.glRank == null) return 1;
			if (b.glRank == null) return -1;
			return a.glRank - b.glRank;
		}
		if (sort === "cp") return (b.cp ?? 0) - (a.cp ?? 0);
		return a.species.localeCompare(b.species);
	});
}

function makeMon(
	overrides: Partial<Mon> & { id: number; species: string },
): Mon {
	return {
		rawName: overrides.species,
		form: null,
		shadow: false,
		purified: false,
		cp: null,
		glRank: null,
		fastMove: null,
		fastMoveType: null,
		fastMoveTurns: null,
		chargeMove1: null,
		chargeMove1Type: null,
		chargeMove1Energy: null,
		chargeMove1Attacks: null,
		chargeMove2: null,
		chargeMove2Type: null,
		chargeMove2Energy: null,
		chargeMove2Attacks: null,
		legacyMove: false,
		legacyMoveName: null,
		hasReturn: false,
		notes: null,
		types: [],
		spriteUrl: "",
		...overrides,
	};
}

const MONS: Mon[] = [
	makeMon({
		id: 6,
		species: "Charizard",
		types: ["fire", "flying"],
		glRank: 50,
		cp: 2889,
		shadow: false,
	}),
	makeMon({
		id: 9,
		species: "Blastoise",
		types: ["water"],
		glRank: 120,
		cp: 2466,
		shadow: true,
	}),
	makeMon({
		id: 131,
		species: "Lapras",
		types: ["water", "ice"],
		glRank: 5,
		cp: 3025,
		shadow: false,
		fastMove: "Ice Shard",
		chargeMove1: "Surf",
		legacyMove: false,
	}),
	makeMon({
		id: 248,
		species: "Tyranitar",
		types: ["rock", "dark"],
		glRank: null,
		cp: 3834,
		shadow: false,
		legacyMove: true,
	}),
	makeMon({
		id: 350,
		species: "Milotic",
		types: ["water"],
		glRank: 200,
		cp: 2967,
		shadow: false,
	}),
];

describe("search", () => {
	it("filters by species name (case-insensitive)", () => {
		const r = filterAndSort(MONS, { search: "blast" });
		expect(r).toHaveLength(1);
		expect(r[0].species).toBe("Blastoise");
	});

	it("filters by numeric id (no #)", () => {
		const r = filterAndSort(MONS, { search: "6" });
		expect(r).toHaveLength(1);
		expect(r[0].species).toBe("Charizard");
	});

	it("filters by #id prefix", () => {
		const r = filterAndSort(MONS, { search: "#9" });
		expect(r).toHaveLength(1);
		expect(r[0].species).toBe("Blastoise");
	});

	it("returns empty for no match", () => {
		expect(filterAndSort(MONS, { search: "mew" })).toHaveLength(0);
	});

	it("comma-delimited: returns union of matches", () => {
		const r = filterAndSort(MONS, { search: "char, 9, mil" });
		const names = r.map((m) => m.species);
		expect(names).toContain("Charizard");
		expect(names).toContain("Blastoise");
		expect(names).toContain("Milotic");
		expect(r).toHaveLength(3);
	});
});

describe("shadow filter", () => {
	it("shadow=yes returns only shadow mons", () => {
		const r = filterAndSort(MONS, { shadow: "yes" });
		expect(r.every((m) => m.shadow)).toBe(true);
	});

	it("shadow=no excludes shadow mons", () => {
		const r = filterAndSort(MONS, { shadow: "no" });
		expect(r.every((m) => !m.shadow)).toBe(true);
	});
});

describe("type filter", () => {
	it("returns only water types", () => {
		const r = filterAndSort(MONS, { typeFilter: "water" });
		expect(r.every((m) => m.types.includes("water"))).toBe(true);
		expect(r.length).toBeGreaterThan(0);
	});

	it("all returns everything", () => {
		expect(filterAndSort(MONS, { typeFilter: "all" })).toHaveLength(
			MONS.length,
		);
	});
});

describe("legacy filter", () => {
	it("legacy=true returns only mons with legacyMove", () => {
		const r = filterAndSort(MONS, { legacy: true });
		expect(r.every((m) => m.legacyMove)).toBe(true);
		expect(r[0].species).toBe("Tyranitar");
	});
});

describe("incomplete filter", () => {
	it("incomplete=true excludes fully-filled mons", () => {
		// Lapras has types, fastMove, chargeMove1, and glRank — should be excluded
		const r = filterAndSort(MONS, { incomplete: true });
		expect(
			r.every(
				(m) =>
					!(
						m.types.length > 0 &&
						m.fastMove &&
						m.chargeMove1 &&
						m.glRank != null
					),
			),
		).toBe(true);
	});
});

describe("sort", () => {
	it("rank: nulls sort last", () => {
		const r = filterAndSort(MONS, { sort: "rank" });
		const lastRank = r[r.length - 1].glRank;
		expect(lastRank).toBeNull();
	});

	it("rank: ascending by glRank", () => {
		const r = filterAndSort(MONS, { sort: "rank" }).filter(
			(m) => m.glRank != null,
		);
		for (let i = 1; i < r.length; i++) {
			expect(r[i].glRank ?? -1).toBeGreaterThanOrEqual(r[i - 1].glRank ?? -1);
		}
	});

	it("cp: descending by cp", () => {
		const r = filterAndSort(MONS, { sort: "cp" });
		for (let i = 1; i < r.length; i++) {
			expect(r[i].cp ?? 0).toBeLessThanOrEqual(r[i - 1].cp ?? 0);
		}
	});

	it("name: alphabetical", () => {
		const r = filterAndSort(MONS, { sort: "name" });
		for (let i = 1; i < r.length; i++) {
			expect(
				r[i].species.localeCompare(r[i - 1].species),
			).toBeGreaterThanOrEqual(0);
		}
	});
});
