"use client";

import type { KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAvatarColor } from "@/lib/getAvatarColor";
import Avatar from "./Avatar";

export default function Header() {
	const router = useRouter();
	const { user } = useAuth();

	const displayName: string = user?.user_metadata?.display_name ?? "";
	const avatarColor = user ? getAvatarColor("", user.id) : "";

	const handleTitleKeyDown = (event: KeyboardEvent<HTMLHeadingElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			router.push("/home");
		}
	};

	return (
		<header
			className="w-full shrink-0"
			style={{
				height: "56px",
				backgroundColor: "var(--color-accent-1)",
			}}
		>
			<div className="mx-auto flex h-full w-full max-w-(--max-width-content) items-center justify-between px-(--page-padding)">
				<h1
					className="cursor-pointer hover:-translate-y-1"
					onClick={() => router.push("/home")}
					onKeyDown={handleTitleKeyDown}
					role="link"
					tabIndex={0}
				>
					<Image
						src="/HazyRoom.png"
						alt="HazyRoom"
						height={80}
						width={100}
						className="h-8 w-auto"
						priority
					/>
				</h1>

				{user && (
					<button
						type="button"
						onClick={() => router.push("/profile")}
						aria-label="Profile"
					>
						<Avatar name={displayName} color={avatarColor} size="md" />
					</button>
				)}
			</div>
		</header>
	);
}
