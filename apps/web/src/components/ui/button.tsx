import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

const variantClasses = {
  primary:
    "bg-dos-primary text-white border border-dos-primary hover:brightness-110 active:border-dos-accent active:shadow-dos-focus",
  secondary: "bg-white text-dos-fg border border-dos-line hover:bg-dos-panel",
  ghost: "bg-transparent text-dos-fg border border-transparent hover:bg-dos-panel",
  danger: "bg-[#FF4D6D] text-white border border-[#FF4D6D] hover:brightness-110"
} as const;

const sizeClasses = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-11 w-11 p-0"
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-dos font-medium tracking-[0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:shadow-dos-focus disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
