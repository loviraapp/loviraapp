"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ConnectionMomentShellProps = {
  children: ReactNode;
  className?: string;
};

export function ConnectionMomentShell({
  children,
  className = "",
}: ConnectionMomentShellProps) {
  return (
    <div className={`cm-shell ${className}`}>
      <div className="cm-shell-glow" aria-hidden />
      <motion.div
        className="cm-shell-orb cm-shell-orb--a"
        aria-hidden
        animate={{ y: [0, -12, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="cm-shell-orb cm-shell-orb--b"
        aria-hidden
        animate={{ y: [0, 10, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div className="cm-shell-inner">{children}</div>
    </div>
  );
}
