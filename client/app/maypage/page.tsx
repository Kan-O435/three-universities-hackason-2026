"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";

type Notice = {
	type: "success" | "error";
	text: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasSupabaseEnv = Boolean(supabaseUrl && supabaseKey);
let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabaseEnvErrorMessage = () => {
	const missing: string[] = [];
	if (!supabaseUrl) {
		missing.push("NEXT_PUBLIC_SUPABASE_URL");
	}
	if (!supabaseKey) {
		missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY または NEXT_PUBLIC_SUPABASE_ANON_KEY");
	}

	if (missing.length === 0) {
		return null;
	}

	return `Supabase設定が不足しています: ${missing.join(" / ")}`;
};

const getSupabaseClient = () => {
	if (!hasSupabaseEnv) {
		return null;
	}

	if (!supabaseClient) {
		supabaseClient = createClient(supabaseUrl as string, supabaseKey as string);
	}

	return supabaseClient;
};

export default function MyPage() {
	const router = useRouter();
	const [userId, setUserId] = useState<string | null>(null);
	const [displayName, setDisplayName] = useState("");
	const [initialDisplayName, setInitialDisplayName] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notice, setNotice] = useState<Notice | null>(null);

	useEffect(() => {
		const loadProfile = async () => {
			if (!hasSupabaseEnv) {
				setNotice({
					type: "error",
					text:
						getSupabaseEnvErrorMessage() ??
						"Supabase設定が不足しています。環境変数を確認してください。",
				});
				setIsLoading(false);
				return;
			}

			const supabase = getSupabaseClient();
			if (!supabase) {
				setNotice({
					type: "error",
					text: "Supabaseクライアントの初期化に失敗しました。",
				});
				setIsLoading(false);
				return;
			}

			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError || !user) {
				router.replace("/");
				return;
			}

			setUserId(user.id);

			const { data, error } = await (supabase as any)
				.from("users")
				.select("display_name")
				.eq("id", user.id)
				.single();

			if (error) {
				setNotice({
					type: "error",
					text: "プロフィール情報の取得に失敗しました。時間をおいて再度お試しください。",
				});
				setIsLoading(false);
				return;
			}

			const currentName = data?.display_name ?? "";
			setDisplayName(currentName);
			setInitialDisplayName(currentName);
			setIsLoading(false);
		};

		void loadProfile();
	}, [router]);

	const canSubmit = useMemo(() => {
		return !isLoading && !isSaving && displayName.trim().length > 0;
	}, [displayName, isLoading, isSaving]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);

		const supabase = getSupabaseClient();
		if (!supabase) {
			setNotice({
				type: "error",
				text:
					getSupabaseEnvErrorMessage() ??
					"Supabase設定が不足しています。環境変数を確認してください。",
			});
			return;
		}

		if (!userId) {
			setNotice({
				type: "error",
				text: "ユーザー情報の確認に失敗しました。再ログインしてください。",
			});
			return;
		}

		const trimmed = displayName.trim();
		if (!trimmed) {
			setNotice({ type: "error", text: "名前を入力してください。" });
			return;
		}

		if (trimmed === initialDisplayName) {
			setNotice({ type: "error", text: "現在の名前と同じです。" });
			return;
		}

		setIsSaving(true);
		const { error } = await (supabase as any)
			.from("users")
			.update({ display_name: trimmed })
			.eq("id", userId);

		if (error) {
			setNotice({
				type: "error",
				text: "名前の更新に失敗しました。時間をおいて再度お試しください。",
			});
			setIsSaving(false);
			return;
		}

		setDisplayName(trimmed);
		setInitialDisplayName(trimmed);
		setNotice({ type: "success", text: "名前を更新しました。" });
		setIsSaving(false);
	};

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
					<h2
						className="text-2xl font-semibold tracking-tight sm:text-3xl"
						style={{ color: "var(--color-text)" }}
					>
						マイページ
					</h2>
					<p
						className="mt-2 text-sm leading-7 sm:text-base"
						style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}
					>
						表示名を変更できます。
					</p>

					<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-1.5">
							<label
								htmlFor="display-name"
								className="text-sm font-medium"
								style={{ color: "var(--color-text)" }}
							>
								名前
							</label>
							<input
								id="display-name"
								name="displayName"
								type="text"
								maxLength={40}
								value={displayName}
								onChange={(event) => {
									setDisplayName(event.target.value);
								}}
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
								borderColor:
									notice.type === "success"
										? "color-mix(in srgb, #2f9e44 35%, white)"
										: "color-mix(in srgb, #e03131 35%, white)",
								backgroundColor:
									notice.type === "success"
										? "color-mix(in srgb, #2f9e44 10%, white)"
										: "color-mix(in srgb, #e03131 10%, white)",
								color:
									notice.type === "success"
										? "color-mix(in srgb, #1f7a34 90%, black)"
										: "color-mix(in srgb, #b02121 90%, black)",
							}}
						>
							{notice.text}
						</p>
					)}
				</section>
			</main>
		</div>
	);
}
