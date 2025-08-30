import { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 
    rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl
      hover:scale-105 active:scale-95 border-0
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300
      text-gray-900 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900
      hover:scale-105 active:scale-95 border-0
    `,
    danger: `
      bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl
      hover:scale-105 active:scale-95 border-0
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        leftIcon && <span>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
