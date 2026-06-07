// components/ui/Button.tsx
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled,
  loading,
  fullWidth,
  className = "",
  type = "button",
}: ButtonProps) => {

  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold
    rounded-full transition-all duration-200 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants: Record<ButtonVariant, string> = {
    // Orange filled — primary CTA (Sign In, Shop Now)
    primary: `
      bg-orange-500 hover:bg-orange-600 active:bg-orange-700
      text-white shadow-md hover:shadow-orange-500/30 hover:shadow-lg
    `,
    // Dark filled — secondary actions (Our Story, Cancel)
    secondary: `
      bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600
      text-white border border-neutral-700
    `,
    // Transparent with border — Sign Up, Login
    outline: `
      bg-transparent border border-orange-500
      text-orange-500 hover:bg-orange-500 hover:text-white
    `,
    // No background — subtle actions (Skip, Maybe Later)
    ghost: `
      bg-transparent text-neutral-400
      hover:text-white hover:bg-neutral-800
    `,
    // Destructive actions (Delete, Remove)
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white shadow-md hover:shadow-red-500/30 hover:shadow-lg
    `,
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "text-xs px-4 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={16} />}
          {label}
          {Icon && iconPosition === "right" && <Icon size={16} />}
        </>
      )}
    </button>
  );
};

export default Button;