import { cn } from "@/lib/cn";
import { InputHTMLAttributes, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({ className, label, helperText, error, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-[11px] uppercase tracking-[0.12em] text-dos-fg/80 font-medium"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-dos border border-dos-line bg-white px-3 text-sm text-dos-fg shadow-dos-sm transition-all duration-150 placeholder:text-dos-fg/45 focus-visible:outline-none focus-visible:shadow-dos-focus",
          error ? "border-[#FF4D6D]" : "",
          className
        )}
        {...props}
      />
      {error ? <p className="text-xs text-[#FF4D6D]">{error}</p> : null}
      {!error && helperText ? <p className="text-xs text-dos-fg/60">{helperText}</p> : null}
    </div>
  );
}
