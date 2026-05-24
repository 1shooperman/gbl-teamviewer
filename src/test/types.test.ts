import { describe, expect, it } from "vitest";
import { cardBackground, TYPE_COLORS, typeIconUrl } from "@/lib/types";

describe("cardBackground", () => {
	it("returns fallback for empty types", () => {
		expect(cardBackground([])).toBe("#C6C6A7");
	});

	it("returns solid color for single type", () => {
		expect(cardBackground(["fire"])).toBe(TYPE_COLORS.fire);
	});

	it("returns gradient for dual types", () => {
		const result = cardBackground(["fire", "water"]);
		expect(result).toContain("linear-gradient");
		expect(result).toContain(TYPE_COLORS.fire);
		expect(result).toContain(TYPE_COLORS.water);
	});

	it("falls back for unknown single type", () => {
		expect(cardBackground(["unknown"])).toBe("#C6C6A7");
	});

	it("falls back gracefully for unknown dual types", () => {
		const result = cardBackground(["fire", "unknown"]);
		expect(result).toContain("linear-gradient");
		expect(result).toContain(TYPE_COLORS.fire);
		expect(result).toContain("#C6C6A7");
	});
});

describe("typeIconUrl", () => {
	it("returns pokesprite URL for a known type", () => {
		expect(typeIconUrl("fire")).toBe(
			"https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/fire.png",
		);
	});

	it("interpolates type name into URL", () => {
		const url = typeIconUrl("dragon");
		expect(url).toContain("dragon");
		expect(url.endsWith(".png")).toBe(true);
	});
});

describe("TYPE_COLORS", () => {
	it("covers all 18 types", () => {
		const expected = [
			"normal",
			"fire",
			"water",
			"electric",
			"grass",
			"ice",
			"fighting",
			"poison",
			"ground",
			"flying",
			"psychic",
			"bug",
			"rock",
			"ghost",
			"dragon",
			"dark",
			"steel",
			"fairy",
		];
		expected.forEach((t) => {
			expect(TYPE_COLORS[t]).toBeDefined();
		});
	});
});
