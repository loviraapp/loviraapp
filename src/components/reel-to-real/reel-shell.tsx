"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ReelShellProps = {
  children: ReactNode;
  className?: string;
};

export function ReelShell({ children, className = "" }: ReelShellProps) {
  return (
    <div className={`rtr-shell ${className}`}>
      <div className="rtr-shell-glow" aria-hidden />
      <motion.span
        className="rtr-float rtr-float--a"
        aria-hidden
        animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.span>
      <motion.span
        className="rtr-float rtr-float--b"
        aria-hidden
        animate={{ y: [0, 10, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        💗
      </motion.span>
      <div className="rtr-shell-inner">{children}</div>
    </div>
  );
}
