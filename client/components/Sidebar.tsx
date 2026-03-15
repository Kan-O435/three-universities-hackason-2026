type SidebarProps = {
  roomId: string;
};

const chatItems = ["All", "one", "two", "three"];

export default function Sidebar({ roomId }: SidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-4 md:w-[220px] md:shrink-0">
      <section>
        <h2 className="mb-2 text-[16px] font-bold text-[#334155]">
          Group {roomId}/Talks
        </h2>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <ul className="space-y-2">
            {chatItems.map((item, index) => (
              <li
                key={item}
                className={`text-[16px] font-medium ${
                  index === 0 ? "text-[#7FA9C9]" : "text-[#4A5568]"
                }`}
              >
                {index === 0 ? `> ${item}` : item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-bold text-[#4A5568]">TimeLimit</p>
        <p className="text-center text-[22px] font-bold text-[#4A5568]">
          48:30:19
        </p>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold text-[#4A5568]">QR</p>
        <div className="mx-auto h-16 w-16 rounded-xl bg-[#D9D9D9]" />
      </section>
    </aside>
  );
}