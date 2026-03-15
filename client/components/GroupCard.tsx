type GroupCardProps = {
  groupName: string;
  timeLabel: string;
  isMemoryMode?: boolean;
  onClick?: () => void;
};

export default function GroupCard({
  groupName,
  timeLabel,
  isMemoryMode = false,
  onClick,
}: GroupCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-[150px] w-[150px] shrink-0 flex-col items-center justify-center
        rounded-[var(--radius-card)]
        shadow-[var(--shadow-card)]
        transition-[transform,box-shadow] duration-200
        hover:-translate-y-1
        sm:h-[160px] sm:w-[160px]
        md:h-[180px] md:w-[180px]
        cursor-pointer
        ${isMemoryMode ? "bg-[var(--color-memory)]" : "bg-[var(--color-accent-2)]"}
      `}
    >
      <span
        className={`
          text-[22px] font-bold leading-none
          sm:text-[24px] md:text-[28px]
          ${isMemoryMode ? "text-[var(--color-text)]" : "text-[var(--color-surface)]"}
        `}
      >
        {groupName}
      </span>

      <span
        className={`
          mt-4 text-[20px] font-semibold leading-none
          sm:text-[22px] md:text-[24px]
          ${isMemoryMode ? "text-[var(--color-accent-2)]" : "text-[var(--color-text)]"}
        `}
      >
        {timeLabel}
      </span>
    </button>
  );
}