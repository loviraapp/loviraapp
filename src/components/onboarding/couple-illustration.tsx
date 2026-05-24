export function CoupleIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="180" y1="0" x2="180" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3F0FA" />
          <stop offset="1" stopColor="#FAF8F7" />
        </linearGradient>
        <linearGradient id="glow" x1="180" y1="80" x2="180" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B59EDB" stopOpacity="0.35" />
          <stop offset="1" stopColor="#B59EDB" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="360" height="280" fill="url(#sky)" />
      <ellipse cx="180" cy="150" rx="120" ry="80" fill="url(#glow)" />
      {/* Left figure */}
      <circle cx="130" cy="118" r="22" fill="#E8E0F0" />
      <path
        d="M98 195c8-38 32-52 32-52s24 14 32 52"
        fill="#D4C8E8"
      />
      <path
        d="M118 138c-6 8-8 18-6 28"
        stroke="#8E7DBE"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Right figure */}
      <circle cx="230" cy="118" r="22" fill="#EDE8F4" />
      <path
        d="M198 195c8-38 32-52 32-52s24 14 32 52"
        fill="#C9BBE0"
      />
      <path
        d="M242 138c6 8 8 18 6 28"
        stroke="#8E7DBE"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Connection — subtle shared warmth */}
      <path
        d="M152 148c12 6 44 6 56 0"
        stroke="#8E7DBE"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <circle cx="180" cy="168" r="6" fill="#B59EDB" opacity="0.45" />
      {/* Ground soft shadow */}
      <ellipse cx="180" cy="218" rx="90" ry="8" fill="#8E7DBE" opacity="0.08" />
      {/* Stars */}
      <circle cx="72" cy="64" r="2" fill="#B59EDB" opacity="0.5" />
      <circle cx="290" cy="52" r="1.5" fill="#B59EDB" opacity="0.4" />
      <circle cx="310" cy="88" r="2" fill="#8E7DBE" opacity="0.35" />
    </svg>
  );
}
