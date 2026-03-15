"use client";

import { QRCodeSVG } from "qrcode.react";

type QRcodeProps = {
	targetPath: string;
	title?: string;
};

export default function QRcode({ targetPath, title = "QRコード" }: QRcodeProps) {
	const qrValue = (() => {
		if (/^https?:\/\//.test(targetPath)) {
			return targetPath;
		}

		const appOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
		const normalizedPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
		return appOrigin ? `${appOrigin}${normalizedPath}` : normalizedPath;
	})();

	return (
		<section
			className="w-full rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]"
			aria-label={title}
		>
			<p className="mb-4 text-sm font-semibold text-[var(--color-text)]">{title}</p>

			<div className="mx-auto w-fit rounded-2xl bg-white p-4">
				<QRCodeSVG
					value={qrValue}
					size={240}
					bgColor="#ffffff"
					fgColor="#1f2937"
					level="M"
					includeMargin
				/>
			</div>

			<p className="mt-4 break-all text-xs text-[var(--color-text)]/80">{qrValue}</p>
		</section>
	);
}
