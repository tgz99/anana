import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "red";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--accent-blue)] hover:bg-[#1a7fe8] text-white shadow-glow-sm hover:shadow-glow",
  secondary:
    "bg-transparent border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:text-white underline underline-offset-4",
  red: "bg-[var(--anana-red)] hover:bg-[var(--anana-red-deep)] text-white shadow-glow-red",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      as = "button",
      href,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (as === "a" && href) {
      return (
        <a href={href} className={classes} {...(props as any)}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
