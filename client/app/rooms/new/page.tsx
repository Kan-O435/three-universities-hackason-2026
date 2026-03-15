"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createRoom } from "@/lib/rooms";

type Notice = {
	type: "success" | "error";
	text: string;
};

const toJstInputValue = (date: Date) => {
	const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
	const year = jst.getUTCFullYear();
	const month = String(jst.getUTCMonth() + 1).padStart(2, "0");
	const day = String(jst.getUTCDate()).padStart(2, "0");
	const hours = String(jst.getUTCHours()).padStart(2, "0");
	const minutes = String(jst.getUTCMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const addHours = (date: Date, hours: number) => {
	return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

const parseJstLocalToIso = (value: string) => {
	const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
	if (!matched) {
		return null;
	}

	const [, year, month, day, hour, minute] = matched;
	const utcMs = Date.UTC(
		Number(year),
		Number(month) - 1,
		Number(day),
		Number(hour) - 9,
		Number(minute),
		0,
		0,
	);

	if (Number.isNaN(utcMs)) {
		return null;
	}

	return new Date(utcMs).toISOString();
};

export default function NewRoomPage() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const [roomName, setRoomName] = useState("");
	const [expiresAtLocal, setExpiresAtLocal] = useState(() => {
		return toJstInputValue(addHours(new Date(), 1));
	});
	const [description, setDescription] = useState("");
	const [notice, setNotice] = useState<Notice | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!loading && !user) router.replace("/");
	}, [user, loading, router]);

	const canSubmit = useMemo(() => {
		return (
			!isSubmitting &&
			roomName.trim().length > 0 &&
			description.trim().length > 0 &&
			expiresAtLocal.length > 0
		);
	}, [description, expiresAtLocal, isSubmitting, roomName]);

	const handleSubmit = () => {
		setNotice(null);

		const trimmedName = roomName.trim();
		const trimmedDescription = description.trim();

		if (!trimmedName) {
			setNotice({ type: "error", text: "ルーム名を入力してください。" });
			return;
		}

		if (trimmedName.length > 50) {
			setNotice({ type: "error", text: "ルーム名は50文字以内で入力してください。" });
			return;
		}

		if (!trimmedDescription) {
			setNotice({ type: "error", text: "概要を入力してください。" });
			return;
		}

		if (trimmedDescription.length > 200) {
			setNotice({ type: "error", text: "概要は200文字以内で入力してください。" });
			return;
		}

		const expiresAtIso = parseJstLocalToIso(expiresAtLocal);
		if (!expiresAtIso) {
			setNotice({
				type: "error",
				text: "有効期限の形式が不正です。日本時間で日時を選択してください。",
			});
			return;
		}

		if (new Date(expiresAtIso).getTime() <= Date.now()) {
			setNotice({
				type: "error",
				text: "有効期限は現在時刻より後の日時を指定してください。",
			});
			return;
		}

		setIsSubmitting(true);
		createRoom(trimmedName, trimmedDescription, expiresAtIso)
			.then((room) => router.push(`/rooms/${room.id}`))
			.catch((err: Error) => setNotice({ type: "error", text: err.message }))
			.finally(() => setIsSubmitting(false));
	};

	if (loading || !user) return null;

	return (
		<main className="mx-auto w-full max-w-(--max-width-content) px-(--page-padding) py-8 md:py-12">
				<section
					className="mx-auto w-full max-w-2xl rounded-(--radius-card) border p-6 shadow-(--shadow-card) sm:p-8"
					style={{
						backgroundColor: "var(--color-surface)",
						borderColor: "color-mix(in srgb, var(--color-accent-2) 24%, white)",
					}}
				>
					<h2
						className="text-2xl font-semibold tracking-tight sm:text-3xl"
						style={{ color: "var(--color-text)" }}
					>
						ルームを作成
					</h2>
					<p
						className="mt-2 text-sm leading-7 sm:text-base"
						style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}
					>
						ルーム名・有効期限・概要を入力して、新しいチャットルームを作成します。
					</p>

					<form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
						<div className="space-y-1.5">
							<label
								htmlFor="room-name"
								className="text-sm font-medium"
								style={{ color: "var(--color-text)" }}
							>
								ルーム名
							</label>
							<input
								id="room-name"
								name="roomName"
								type="text"
								required
								maxLength={50}
								value={roomName}
								onChange={(event) => {
									setRoomName(event.target.value);
								}}
								disabled={isSubmitting}
								placeholder="例: 卒業旅行の相談"
								className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
								style={{
									borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
									backgroundColor: "var(--color-surface)",
									color: "var(--color-text)",
								}}
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="expires-at"
								className="text-sm font-medium"
								style={{ color: "var(--color-text)" }}
							>
								有効期限
							</label>
							<input
								id="expires-at"
								name="expiresAt"
								type="datetime-local"
								required
								value={expiresAtLocal}
								onChange={(event) => {
									setExpiresAtLocal(event.target.value);
								}}
								disabled={isSubmitting}
								className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
								style={{
									borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
									backgroundColor: "var(--color-surface)",
									color: "var(--color-text)",
								}}
							/>
							<p
								className="text-xs"
								style={{ color: "color-mix(in srgb, var(--color-text) 70%, white)" }}
							>
								日本時間（JST）で指定してください。
							</p>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="description"
								className="text-sm font-medium"
								style={{ color: "var(--color-text)" }}
							>
								概要
							</label>
							<textarea
								id="description"
								name="description"
								required
								maxLength={200}
								value={description}
								onChange={(event) => {
									setDescription(event.target.value);
								}}
								disabled={isSubmitting}
								placeholder="このルームで話す内容を簡単に入力してください。"
								rows={4}
								className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
								style={{
									borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
									backgroundColor: "var(--color-surface)",
									color: "var(--color-text)",
									resize: "vertical",
								}}
							/>
						</div>

						<button
							type="submit"
							disabled={!canSubmit}
							className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
							style={{ backgroundColor: "var(--color-accent-2)" }}
						>
							{isSubmitting ? "作成中..." : "ルームを作成"}
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
	);
}
