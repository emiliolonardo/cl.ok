import { cn } from "@/lib/cn";
import { SelectHTMLAttributes, useId } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
}

export function Select({ className, label, helperText, id, children, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label
          htmlFor={selectId}
          className="block text-[11px] uppercase tracking-[0.12em] text-dos-fg/80 font-medium"
        >
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          "h-11 w-full rounded-dos border border-dos-line bg-white px-3 text-sm text-dos-fg shadow-dos-sm transition-all duration-150 focus-visible:outline-none focus-visible:shadow-dos-focus",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {helperText ? <p className="text-xs text-dos-fg/60">{helperText}</p> : null}
    </div>
  );
}
