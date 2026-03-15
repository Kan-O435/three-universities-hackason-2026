import GroupCard from "@/components/GroupCard";
import CreateGroupCard from "@/components/CreateGroupCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-[var(--page-padding)] py-10">
      <div className="mx-auto max-w-[var(--max-width-content)]">
        <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]">
          Home Preview
        </h1>

        <div className="flex flex-wrap gap-6">
          <CreateGroupCard />
          <GroupCard groupName="Group A" timeLabel="20:19" />
          <GroupCard groupName="Group B" timeLabel="3日" />
          <GroupCard groupName="Group C" timeLabel="00:00" isMemoryMode />
        </div>
      </div>
    </main>
  );
}