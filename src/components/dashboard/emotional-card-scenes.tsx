/** Editorial mini-scenes — original Lovira art, onboarding palette */

import type { ReactNode } from "react";

function SceneFrame({ children, id }: { children: ReactNode; id: string }) {
  return (
    <svg
      viewBox="0 0 280 128"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="140" y1="0" x2="140" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDE8F4" />
          <stop offset="1" stopColor="#D4C8E8" />
        </linearGradient>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#B59EDB" stopOpacity="0.45" />
          <stop offset="1" stopColor="#B59EDB" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="280" height="128" fill={`url(#${id}-sky)`} />
      {children}
    </svg>
  );
}

export function SceneCheckIn() {
  return (
    <SceneFrame id="check">
      <ellipse cx="140" cy="72" rx="80" ry="36" fill="url(#check-glow)" />
      <path d="M56 96h168" stroke="#9A84C4" strokeWidth="1" strokeOpacity="0.5" />
      <ellipse cx="108" cy="58" rx="14" ry="15" fill="#F3F0FA" stroke="#5C5470" strokeWidth="1.1" />
      <path d="M108 73c-18 0-30 14-32 32l-6 22h76l-6-22c-2-18-14-32-32-32z" fill="#5C5470" />
      <ellipse cx="172" cy="56" rx="13" ry="14" fill="#F3F0FA" stroke="#7568A8" strokeWidth="1.1" />
      <path d="M172 70c-16 0-28 12-30 28l-5 20h70l-5-20c-2-16-12-28-30-28z" fill="#7568A8" />
      <path d="M118 60c10-8 22-8 32 0" stroke="#8E7DBE" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
    </SceneFrame>
  );
}

export function SceneSupport() {
  return (
    <SceneFrame id="support">
      <ellipse cx="140" cy="68" rx="72" ry="40" fill="url(#support-glow)" />
      <ellipse cx="112" cy="62" rx="13" ry="14" fill="#F3F0FA" stroke="#5C5470" strokeWidth="1" />
      <path d="M112 76c-16 0-28 11-30 26l-5 18h70l-5-18c-2-15-14-26-30-26z" fill="#6B6280" />
      <ellipse cx="168" cy="58" rx="12" ry="13" fill="#F3F0FA" stroke="#7568A8" strokeWidth="1" />
      <path d="M168 71c-14 0-26 10-28 24l-5 16h66l-5-16c-2-14-14-24-28-24z" fill="#8E7DBE" />
      <path d="M124 64c12-10 26-10 38 0" stroke="#7568A8" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <path d="M196 72h28c2 0 4 2 4 4v8c0 2-2 4-4 4h-28" stroke="#7568A8" strokeWidth="1" fill="#C9BBE0" fillOpacity="0.55" />
    </SceneFrame>
  );
}

export function SceneRitual() {
  return (
    <SceneFrame id="ritual">
      <path d="M72 92h136" stroke="#9A84C4" strokeWidth="1" strokeOpacity="0.45" />
      <path d="M96 92c0-22 16-38 44-38s44 16 44 38" fill="#B59EDB" fillOpacity="0.28" stroke="#9A84C4" strokeWidth="0.9" />
      <ellipse cx="140" cy="48" rx="12" ry="13" fill="#F3F0FA" stroke="#7568A8" strokeWidth="1" />
      <path d="M140 61c-14 0-26 10-28 24l-5 18h66l-5-18c-2-14-14-24-28-24z" fill="#7568A8" />
      <circle cx="140" cy="34" r="5" fill="#B59EDB" />
      <path d="M140 29v-8M136 24h8" stroke="#8E7DBE" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="168" y="76" width="36" height="5" rx="2" fill="#9A84C4" fillOpacity="0.45" />
      <path d="M178 76v-12c0-3 2-5 5-5h2c3 0 5 2 5 5v12" stroke="#7568A8" strokeWidth="0.9" fill="#EDE8F4" />
    </SceneFrame>
  );
}

export function ScenePartner() {
  return (
    <SceneFrame id="partner">
      <ellipse cx="140" cy="70" rx="68" ry="34" fill="url(#partner-glow)" />
      <ellipse cx="118" cy="60" rx="14" ry="15" fill="#F3F0FA" stroke="#5C5470" strokeWidth="1" />
      <path d="M118 75c-18 0-30 13-32 28l-6 20h76l-6-20c-2-15-14-28-32-28z" fill="#5C5470" />
      <ellipse cx="168" cy="56" rx="13" ry="14" fill="#F3F0FA" stroke="#7568A8" strokeWidth="1" />
      <path d="M168 70c-16 0-28 11-30 26l-5 18h70l-5-18c-2-15-14-26-30-26z" fill="#8E7DBE" />
      <path d="M132 62c10 8 22 10 32 4" stroke="#7568A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <path d="M188 58c6 4 12 6 18 4" stroke="#B59EDB" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
    </SceneFrame>
  );
}

export function SceneStreak() {
  return (
    <SceneFrame id="streak">
      <path d="M64 72h152" stroke="#9A84C4" strokeWidth="1" strokeDasharray="5 5" opacity="0.55" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${88 + i * 36}, 0)`}>
          <circle cx="0" cy="72" r="10" fill="#B59EDB" opacity={0.22 + i * 0.12} />
          <circle cx="0" cy="72" r="5" fill="#8E7DBE" opacity={0.45 + i * 0.12} />
          {i < 3 ? (
            <path d="M10 72h16" stroke="#C9BBE0" strokeWidth="2" strokeLinecap="round" />
          ) : null}
        </g>
      ))}
      <path d="M108 44c5-8 14-8 18 0M160 42c4-6 11-6 15 0" stroke="#9A84C4" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </SceneFrame>
  );
}

export function SceneCelebrate() {
  return (
    <SceneFrame id="celebrate">
      <ellipse cx="140" cy="72" rx="76" ry="38" fill="url(#celebrate-glow)" />
      <ellipse cx="118" cy="62" rx="12" ry="13" fill="#F3F0FA" stroke="#5C5470" strokeWidth="1" />
      <ellipse cx="162" cy="62" rx="12" ry="13" fill="#F3F0FA" stroke="#7568A8" strokeWidth="1" />
      <path d="M118 75c-10 0-18 7-20 16M162 75c10 0 18 7 20 16" stroke="#7568A8" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      <path d="M128 78c8 6 16 6 24 0" stroke="#8E7DBE" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <circle cx="96" cy="38" r="3" fill="#B59EDB" opacity="0.75" />
      <circle cx="184" cy="34" r="3.5" fill="#B59EDB" opacity="0.55" />
      <circle cx="200" cy="48" r="2" fill="#C9BBE0" opacity="0.7" />
    </SceneFrame>
  );
}
