import type { Metadata } from "next";
import "./globals.css";
import { Chakra_Petch } from "next/font/google";

const chakra = Chakra_Petch({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-chakra",
});

export const metadata: Metadata = {
	title: "GBL Collection",
	description: "Pokemon GO Battle League built mons",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={chakra.variable}>
			<body>{children}</body>
		</html>
	);
}
