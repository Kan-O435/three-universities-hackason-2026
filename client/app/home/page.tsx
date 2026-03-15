"use client";

import { useState } from "react";
import Header from "@/components/Header";
import GroupCard from "@/components/GroupCard";
import CreateGroupCard from "@/components/CreateGroupCard";

const activeGroups = [
  { id: 1, name: "Group A", timeLabel: "20:19" },
  { id: 2, name: "Group C", timeLabel: "3日" },
  { id: 3, name: "Group F", timeLabel: "5時間" },
];

const memoryGroups = [
  { id: 4, name: "Group B", timeLabel: "00:00" },
  { id: 5, name: "Group D", timeLabel: "00:00" },
  { id: 6, name: "Group E", timeLabel: "00:00" },
];

export default function HomePage() {
  const [isMemoryMode, setIsMemoryMode] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />

      <main className="px-[var(--page-padding)] py-6">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          {/* toggle + mode label */}
          <div className="mb-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMemoryMode((prev) => !prev)}
              className="relative flex h-8 w-16 items-center rounded-full bg-[var(--color-memory)] px-1 transition-colors"
            >
              <span
                className={`h-6 w-6 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition-transform duration-200 ${
                  isMemoryMode ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>

            <span className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
              {isMemoryMode ? "Memory" : "Active"}
            </span>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isMemoryMode && <CreateGroupCard />}

            {!isMemoryMode &&
              activeGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  groupName={group.name}
                  timeLabel={group.timeLabel}
                />
              ))}

            {isMemoryMode &&
              memoryGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  groupName={group.name}
                  timeLabel={group.timeLabel}
                  isMemoryMode
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}