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
    <section className="flex-1 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-sm md:flex-none md:p-4">
      <p className="mb-1 text-sm font-bold text-[#4A5568] md:mb-2">TimeLimit</p>
      <p className="text-center text-lg font-bold text-[#4A5568] md:text-[22px]">
        {timeText}
      </p>
    </section>
  );
}
