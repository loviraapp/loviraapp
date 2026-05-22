"use client";

import { useState, type ReactNode } from "react";

type ExpandSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ExpandSection({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: ExpandSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left text-sm text-muted transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        {title}
        <span
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border/40 pb-2 pt-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}
