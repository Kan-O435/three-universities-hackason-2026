import Link from "next/link";
import TimeLimitCard from "@/components/TimeLimitCard";
import QrInviteCard from "@/components/QrInviteCard";

type SidebarProps = {
  roomId: string;
  activeChat: string;
};

const chats = [
  { id: "all", name: "All", type: "group", href: "" },
  { id: "u1", name: "AAAAA", type: "dm", href: "dm/u1" },
  { id: "u2", name: "BBBBB", type: "dm", href: "dm/u2" },
  { id: "u3", name: "CCCCC", type: "dm", href: "dm/u3" },
];

export default function Sidebar({ roomId, activeChat }: SidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-4 md:w-[220px] md:shrink-0">
      <section>
        <h2 className="mb-2 text-[16px] font-bold text-[#334155]">
          Group {roomId}/Talks
        </h2>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <ul className="space-y-0.5">
            {chats.map((chat) => {
              const isActive = activeChat === chat.id;
              const href =
                chat.id === "all"
                  ? `/rooms/${roomId}`
                  : `/rooms/${roomId}/${chat.href}`;

              return (
                <li key={chat.id}>
                  <Link
                    href={href}
                    className={`flex w-full items-center rounded-xl px-2 py-1 text-left text-[16px] font-medium transition ${
                      isActive
                        ? "text-[#7FA9C9]"
                        : "text-[#4A5568] hover:bg-[#F6F7F9]"
                    }`}
                  >
                    <span className="mr-2 inline-block w-4">
                      {isActive ? ">" : ""}
                    </span>
                    <span>{chat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <TimeLimitCard timeText="20:19" />

      <QrInviteCard />
    </aside>
  );
}