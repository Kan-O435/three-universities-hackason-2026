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

	const navigateToMyPage = () => {
		router.push("/maypage");
	};

	return (
		<header
			className="w-full"
			style={{
				height: "56px",
				backgroundColor: "var(--color-accent-1)",
			}}
		>
			<div className="mx-auto flex h-full w-full max-w-(--max-width-content) items-center justify-between px-(--page-padding)">
				<h1
					className="cursor-pointer hover:-translate-y-1 font-bold text-2xl tracking-tight"
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

				<button
					type="button"
					onClick={navigateToMyPage}
					className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold cursor-pointer transition hover:brightness-95"
					style={{
						backgroundColor: "var(--color-bg)",
						color: "var(--color-accent-2)",
					}}
					aria-label="マイページ"
				>
					My
				</button>
			</div>
		</header>
	);
}
