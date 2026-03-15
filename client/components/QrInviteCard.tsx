import Link from "next/link";

type QrInviteCardProps = {
  roomId: string;
};

export default function QrInviteCard({ roomId }: QrInviteCardProps) {
  return (
    <section className="flex-1 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-sm md:flex-none md:p-4">
      <p className="mb-2 text-sm font-bold text-[#4A5568] md:mb-3">QR</p>

      <Link
        href={`/rooms/${roomId}/invite`}
        className="block w-full rounded-xl bg-[#7FA9C9] py-2 text-center text-sm font-semibold text-white transition transform hover:-translate-y-0.5 hover:bg-[#6F9ABB]"
      >
        Show
      </Link>
    </section>
  );
}
