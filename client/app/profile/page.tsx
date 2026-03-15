"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateDisplayName, signOut } from "@/lib/auth";
import Header from "@/components/Header";

type Notice = { type: "success" | "error"; text: string };

export default function ProfilePage() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const [displayName, setDisplayName] = useState("");
	const [initialDisplayName, setInitialDisplayName] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notice, setNotice] = useState<Notice | null>(null);

	useEffect(() => {
		if (!loading && !user) router.replace("/auth");
	}, [user, loading, router]);

	useEffect(() => {
		if (!user) return;
		getProfile(user.id)
			.then((profile) => {
				setDisplayName(profile.display_name);
				setInitialDisplayName(profile.display_name);
			})
			.catch(() => setNotice({ type: "error", text: "プロフィール情報の取得に失敗しました。" }))
			.finally(() => setIsLoading(false));
	}, [user]);

	const canSubmit = useMemo(
		() => !isLoading && !isSaving && displayName.trim().length > 0,
		[displayName, isLoading, isSaving],
	);

	const handleSubmit = () => {
		if (!user) return;
		const trimmed = displayName.trim();
		if (trimmed === initialDisplayName) {
			setNotice({ type: "error", text: "現在の名前と同じです。" });
			return;
		}
		setNotice(null);
		setIsSaving(true);
		updateDisplayName(user.id, trimmed)
			.then(() => {
				setInitialDisplayName(trimmed);
				setNotice({ type: "success", text: "名前を更新しました。" });
			})
			.catch(() => setNotice({ type: "error", text: "名前の更新に失敗しました。" }))
			.finally(() => setIsSaving(false));
	};

	const handleSignOut = () => {
		signOut()
			.then(() => router.replace("/"))
			.catch(() => setNotice({ type: "error", text: "ログアウトに失敗しました。" }));
	};

	if (loading || !user) return null;

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="mx-auto w-full max-w-(--max-width-content) px-(--page-padding) py-8 md:py-12">
				<section
					className="mx-auto w-full max-w-xl rounded-(--radius-card) border p-6 shadow-(--shadow-card) sm:p-8"
					style={{
						backgroundColor: "var(--color-surface)",
						borderColor: "color-mix(in srgb, var(--color-accent-2) 24%, white)",
					}}
				>
					<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: "var(--color-text)" }}>
						プロフィール
					</h2>
					<p className="mt-2 text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
						{user.email}
					</p>

					<form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
						<div className="space-y-1.5">
							<label htmlFor="display-name" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
								表示名
							</label>
							<input
								id="display-name"
								type="text"
								maxLength={40}
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								disabled={isLoading || isSaving}
								placeholder={isLoading ? "読み込み中..." : "表示名を入力"}
								className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
								style={{
									borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
									backgroundColor: "var(--color-surface)",
									color: "var(--color-text)",
								}}
							/>
						</div>
						<button
							type="submit"
							disabled={!canSubmit}
							className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
							style={{ backgroundColor: "var(--color-accent-2)" }}
						>
							{isSaving ? "保存中..." : "保存"}
						</button>
					</form>

					{notice && (
						<p
							className="mt-4 rounded-lg border px-4 py-3 text-sm"
							style={{
								borderColor: notice.type === "success" ? "color-mix(in srgb, #2f9e44 35%, white)" : "color-mix(in srgb, #e03131 35%, white)",
								backgroundColor: notice.type === "success" ? "color-mix(in srgb, #2f9e44 10%, white)" : "color-mix(in srgb, #e03131 10%, white)",
								color: notice.type === "success" ? "color-mix(in srgb, #1f7a34 90%, black)" : "color-mix(in srgb, #b02121 90%, black)",
							}}
						>
							{notice.text}
						</p>
					)}

					<button
						type="button"
						onClick={handleSignOut}
						className="mt-6 w-full rounded-xl border px-4 py-3 text-sm font-semibold tracking-wide transition hover:brightness-95"
						style={{
							borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
							color: "var(--color-text)",
						}}
					>
						ログアウト
					</button>
				</section>
			</main>
		</div>
	);
}
