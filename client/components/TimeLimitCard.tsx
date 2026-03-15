"use client";

import { useEffect, useState } from "react";
import { formatTimeLabel } from "@/lib/formatTimeLabel";

type TimeLimitCardProps = {
  expiresAt: string;
};

export default function TimeLimitCard({ expiresAt }: TimeLimitCardProps) {
  const [timeText, setTimeText] = useState(() => formatTimeLabel(expiresAt));

  useEffect(() => {
    setTimeText(formatTimeLabel(expiresAt));
    const id = setInterval(() => setTimeText(formatTimeLabel(expiresAt)), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-bold text-[#4A5568]">TimeLimit</p>
      <p className="text-center text-[22px] font-bold text-[#4A5568]">
        {timeText}
      </p>
    </section>
  );
}
