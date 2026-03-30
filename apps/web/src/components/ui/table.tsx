import { cn } from "@/lib/cn";
import { HTMLAttributes, TableHTMLAttributes, forwardRef } from "react";

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table ref={ref} className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  )
);

Table.displayName = "Table";

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border-b border-dos-line text-[11px] uppercase tracking-[0.12em] text-dos-fg/70 font-medium",
      className
    )}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("divide-y divide-dos-line", className)} {...props} />
);

TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("transition-colors hover:bg-dos-panel/50", className)} {...props} />
  )
);

TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("px-3 py-3 text-left font-medium", className)} {...props} />
  )
);

TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn("px-3 py-3", className)} {...props} />
);

TableCell.displayName = "TableCell";

export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("mt-3 text-left text-xs text-dos-fg/60", className)} {...props} />;
}
