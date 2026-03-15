type TimeLimitCardProps = {
  timeText: string;
};

export default function TimeLimitCard({ timeText }: TimeLimitCardProps) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-bold text-[#4A5568]">TimeLimit</p>
      <p className="text-center text-[22px] font-bold text-[#4A5568]">
        {timeText}
      </p>
    </section>
  );
}