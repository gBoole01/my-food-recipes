import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  children: ReactNode;
};

export function Chip({ selected = false, className = "", children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={`min-h-11 rounded-pill border-2 border-primary px-4 py-2 text-sm font-semibold transition ${
        selected ? "bg-primary text-white" : "bg-transparent text-primary"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
