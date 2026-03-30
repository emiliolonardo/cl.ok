"use client";

import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode, createContext, useContext, useMemo, useState } from "react";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs />");
  }
  return context;
}

type TabsProps = {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue: (nextValue: string) => {
        if (value === undefined) {
          setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
      }
    }),
    [currentValue, onValueChange, value]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("space-y-3", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex border-b border-dos-line", className)} {...props} />;
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors",
        isActive ? "text-dos-primary" : "text-dos-fg/70 hover:text-dos-fg",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      {props.children}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-full transition-colors",
          isActive ? "bg-dos-primary" : "bg-transparent"
        )}
      />
    </button>
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ className, value, ...props }: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) {
    return null;
  }
  return <div className={cn("pt-1", className)} {...props} />;
}
