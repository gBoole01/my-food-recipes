import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  secondary: "border-2 border-border bg-transparent text-ink hover:bg-surface-alt",
  ghost: "bg-transparent text-primary hover:underline px-1",
};

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      className={`min-h-11 rounded-md px-5 py-3 text-base font-bold transition disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-muted ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
