// ページ遷移はまだやっていない
export default function Header() {
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
					className="font-bold text-2xl tracking-tight"
					style={{ color: "var(--color-text)" }}
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
