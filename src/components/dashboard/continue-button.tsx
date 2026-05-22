type ContinueButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
}: ContinueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
    >
      {label}
    </button>
  );
}
