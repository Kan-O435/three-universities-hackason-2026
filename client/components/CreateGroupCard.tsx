type CreateGroupCardProps = {
  onClick?: () => void;
};

export default function CreateGroupCard({ onClick }: CreateGroupCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full aspect-square flex-col items-center justify-center
        rounded-[var(--radius-card)]
        bg-[var(--color-surface)]
        shadow-[var(--shadow-card)]
        transition-[transform,box-shadow] duration-200
        hover:-translate-y-1
        cursor-pointer
      "
    >
      <span className="text-[40px] font-semibold leading-none text-[var(--color-text)] sm:text-[44px] md:text-[48px]">
        +
      </span>

      <span className="mt-3 text-center text-[18px] font-semibold leading-tight text-[var(--color-text)] sm:text-[20px] md:text-[22px]">
        New Room
      </span>
    </button>
  );
}