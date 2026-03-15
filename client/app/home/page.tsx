import GroupCard from "@/components/GroupCard";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-[var(--color-bg)]">
      <GroupCard groupName="Group A" timeLabel="20:19" />
      <GroupCard groupName="Group B" timeLabel="00:00" isMemoryMode />
      <GroupCard groupName="Group C" timeLabel="3日" />
    </div>
  );
}