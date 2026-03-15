"use client";

import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
	const router = useRouter();

	const navigateToHome = () => {
		router.push("/home");
	};

	const handleTitleKeyDown = (event: KeyboardEvent<HTMLHeadingElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			navigateToHome();
		}
	};

	return (
		<header
			className="w-full"
			style={{
				height: "88px",
				backgroundColor: "var(--color-accent-1)",
			}}
		>
			<div className="mx-auto flex h-full w-full max-w-[var(--max-width-content)] items-center justify-between px-[var(--page-padding)]">
				<h1
					className="cursor-pointer font-bold text-2xl tracking-tight"
					style={{ color: "var(--color-text)" }}
					onClick={() => {
						navigateToHome();
					}}
					onKeyDown={handleTitleKeyDown}
					role="link"
					tabIndex={0}
				>
					HazyRoom
				</h1>

				<div
					className="flex h-[60px] w-[60px] items-center justify-center rounded-full text-lg font-semibold"
					style={{
						backgroundColor: "var(--color-bg)",
						color: "var(--color-accent-2)",
					}}
					aria-label="My icon"
				>
					My
				</div>
			</div>
		</header>
	);
}
