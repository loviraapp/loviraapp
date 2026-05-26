"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function ReelStepOffline() {
  return (
    <motion.div
      className="rtr-offline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rtr-offline-glow" aria-hidden />
      <motion.div
        className="rtr-offline-heart"
        aria-hidden
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ❤️
      </motion.div>

      <h2 className="rtr-offline-title font-display">
        Now put the phones down for a moment{" "}
        <span aria-hidden>❤️</span>
      </h2>

      <p className="rtr-offline-sub">
        The best part is the conversation after the reel.
      </p>

      <motion.div
        className="rtr-offline-actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/connection-moment" className="rtr-btn rtr-btn--primary">
          Start Together Mode
        </Link>
        <Link href="/" className="rtr-text-link">
          Back home
        </Link>
      </motion.div>
    </motion.div>
  );
}
