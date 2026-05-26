export function CoupleIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Two people sitting together in a calm evening, sharing quiet companionship"
    >
      <defs>
        <linearGradient id="evening-sky" x1="180" y1="0" x2="180" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3F0FA" />
          <stop offset="0.55" stopColor="#EDE8F4" />
          <stop offset="1" stopColor="#E8E2F0" />
        </linearGradient>
        <linearGradient id="lamp-glow" x1="72" y1="48" x2="72" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B59EDB" stopOpacity="0.28" />
          <stop offset="1" stopColor="#B59EDB" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="figure-a" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#6B6280" />
          <stop offset="1" stopColor="#5C5470" />
        </linearGradient>
        <linearGradient id="figure-b" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#8E7DBE" />
          <stop offset="1" stopColor="#7568A8" />
        </linearGradient>
      </defs>

      {/* Canvas */}
      <rect width="360" height="220" rx="18" fill="url(#evening-sky)" />

      {/* Dusk window — editorial, not cartoon */}
      <rect x="248" y="28" width="88" height="64" rx="4" fill="#E0D8EC" fillOpacity="0.7" />
      <rect x="256" y="36" width="72" height="48" rx="2" fill="#D4C8E8" fillOpacity="0.5" />
      <path
        d="M292 36v48M256 60h72"
        stroke="#9A84C4"
        strokeWidth="0.75"
        strokeOpacity="0.5"
      />
      {/* Evening sky hint */}
      <circle cx="310" cy="52" r="8" fill="#C9BBE0" fillOpacity="0.35" />

      {/* Floor line */}
      <path d="M32 178h296" stroke="#D4C8E8" strokeWidth="1" strokeOpacity="0.6" />

      {/* Lamp + warm pool */}
      <ellipse cx="72" cy="100" rx="56" ry="48" fill="url(#lamp-glow)" />
      <path
        d="M64 56h16c2 0 4 2 4 4v52c0 2-2 4-4 4h-16c-2 0-4-2-4-4V60c0-2 2-4 4-4z"
        fill="#9A84C4"
        fillOpacity="0.35"
        stroke="#7568A8"
        strokeWidth="1"
      />
      <path d="M56 112h32" stroke="#7568A8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Low sofa — minimal geometry */}
      <path
        d="M48 152h264c6 0 10 4 10 10v14H38v-14c0-6 4-10 10-10z"
        fill="#C9BBE0"
        fillOpacity="0.45"
      />
      <path
        d="M56 152c0-18 14-32 32-32h184c18 0 32 14 32 32"
        fill="#B59EDB"
        fillOpacity="0.25"
        stroke="#9A84C4"
        strokeWidth="1"
      />

      {/* Partner A — grounded, listening */}
      <ellipse cx="128" cy="98" rx="14" ry="15" fill="#EDE8F4" stroke="#5C5470" strokeWidth="1.25" />
      <path
        d="M128 113c-18 0-30 14-32 32l-6 24h76l-6-24c-2-18-14-32-32-32z"
        fill="url(#figure-a)"
      />
      <path
        d="M120 100c4 2 10 2 16 0"
        stroke="#5C5470"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />

      {/* Partner B — leaning in, supported */}
      <ellipse cx="168" cy="94" rx="13" ry="14" fill="#F3F0FA" stroke="#5C5470" strokeWidth="1.25" />
      <path
        d="M168 108c-16 0-26 12-28 28l-4 20h60l-4-20c-2-16-12-28-28-28z"
        fill="url(#figure-b)"
        fillOpacity="0.9"
      />
      <path
        d="M162 96c3 2 8 2 12 0"
        stroke="#5C5470"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.65"
      />

      {/* Support hand — intimacy without romance */}
      <path
        d="M148 128c6-8 16-10 24-4"
        stroke="#5C5470"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <ellipse cx="152" cy="124" rx="5" ry="4" fill="#EDE8F4" stroke="#5C5470" strokeWidth="1" />

      {/* Shared throw — single clean line */}
      <path
        d="M96 142c28 12 88 12 116 0"
        stroke="#FAF8F7"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M96 142c28 12 88 12 116 0"
        stroke="#D4C8E8"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Tea table between — reconnection ritual */}
      <rect x="198" y="138" width="48" height="6" rx="2" fill="#9A84C4" fillOpacity="0.3" />
      <path
        d="M210 138v-10c0-3 2-5 5-5h4c3 0 5 2 5 5v10"
        stroke="#7568A8"
        strokeWidth="1"
        fill="#EDE8F4"
        fillOpacity="0.8"
      />
      <path
        d="M228 138v-10c0-3 2-5 5-5h4c3 0 5 2 5 5v10"
        stroke="#7568A8"
        strokeWidth="1"
        fill="#EDE8F4"
        fillOpacity="0.8"
      />
      <path d="M212 124c0-3 2-5 4-5M230 124c0-3 2-5 4-5" stroke="#B59EDB" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />

      {/* Subtle connection mark — not a heart */}
      <circle cx="180" cy="118" r="2" fill="#8E7DBE" fillOpacity="0.4" />
    </svg>
  );
}
