"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { isValidReelUrl } from "@/lib/reel-to-real";

type StepShareProps = {
  onAnalyze: (url: string) => void;
};

const PLATFORMS = [
  { id: "instagram", label: "Instagram Reels", icon: "📸" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
] as const;

export function ReelStepShare({ onAnalyze }: StepShareProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Paste a reel link to continue.");
      return;
    }
    if (!isValidReelUrl(trimmed)) {
      setError("Use an Instagram Reel, TikTok, or YouTube Shorts link.");
      return;
    }
    setError("");
    onAnalyze(trimmed);
  }

  return (
    <motion.div
      className="rtr-step"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className="rtr-emoji-hero"
        aria-hidden
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        🎬
      </motion.p>

      <h1 className="rtr-title font-display">
        Turn reels into real moments{" "}
        <span className="rtr-title-heart" aria-hidden>
          ❤️
        </span>
      </h1>

      <p className="rtr-lead">
        Sometimes the things we share say more than we realize.
      </p>

      <ul className="rtr-platforms" aria-label="Supported platforms">
        {PLATFORMS.map((p, i) => (
          <motion.li
            key={p.id}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
          >
            <span aria-hidden>{p.icon}</span>
            {p.label}
          </motion.li>
        ))}
      </ul>

      <form className="rtr-form" onSubmit={handleSubmit}>
        <label className="rtr-label" htmlFor="reel-url">
          Paste a reel link
        </label>
        <input
          id="reel-url"
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder="https://..."
          className="rtr-input"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
        />
        {error ? (
          <p className="rtr-error" role="alert">
            {error}
          </p>
        ) : null}

        <motion.button
          type="submit"
          className="rtr-btn rtr-btn--primary"
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -2 }}
        >
          Understand this reel
        </motion.button>
      </form>
    </motion.div>
  );
}
