import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import NavigationHeader from "@/components/navigationheader";

export const metadata: Metadata = {
	title: "Swift",
	description:
		"A fast, open-source voice assistant powered by Groq, Cartesia, and Vercel.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			
			<body
				className={clsx(
					GeistSans.variable,
					GeistMono.variable,
					"py-8 px-6 lg:p-10 dark:text-white bg-white dark:bg-black min-h-dvh flex flex-col justify-between antialiased font-sans select-none"
				)}
			>
				
				<main className="flex flex-col items-start justify-start grow">
					<div><NavigationHeader /></div>
					<div>{children}</div>
				</main>

				<Toaster richColors theme="system" />
				<Analytics />
			</body>
		</html>
	);
}
