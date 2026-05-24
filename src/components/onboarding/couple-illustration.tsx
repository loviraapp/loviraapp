export function CoupleIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      width="320"
      height="200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="A couple sitting together on a couch, one leaning on the other's shoulder"
    >
      {/* Card background */}
      <rect
        x="4"
        y="4"
        width="312"
        height="192"
        rx="16"
        fill="#FFFFFF"
        stroke="#D4C8E8"
        strokeWidth="1.5"
      />

      {/* Warm window */}
      <rect x="20" y="20" width="68" height="52" rx="6" fill="#F3F0FA" stroke="#C9BBE0" strokeWidth="1" />
      <path d="M54 20v52M20 46h68" stroke="#B59EDB" strokeWidth="1" opacity="0.6" />

      {/* Couch base */}
      <path
        d="M72 150h188c10 0 18 8 18 18v10H54v-10c0-10 8-18 18-18z"
        fill="#9A84C4"
        stroke="#7568A8"
        strokeWidth="1.2"
      />
      <path
        d="M72 150c0-22 18-40 40-40h96c22 0 40 18 40 40"
        fill="#B59EDB"
        stroke="#7568A8"
        strokeWidth="1.2"
      />
      <path d="M66 168h204c8 0 14 6 14 14v8H52v-8c0-8 6-14 14-14z" fill="#8E7DBE" />

      {/* Left partner */}
      <circle cx="142" cy="86" r="17" fill="#EDE8F4" stroke="#7568A8" strokeWidth="1.5" />
      <path
        d="M142 103c-16 0-28 12-30 28l-5 22h68l-5-22c-2-16-14-28-28-28z"
        fill="#7568A8"
        stroke="#5C5470"
        strokeWidth="1.2"
      />
      {/* Closed-eye calm expression */}
      <path d="M134 88c3 2 8 2 12 0" stroke="#5C5470" strokeWidth="1.2" strokeLinecap="round" />

      {/* Right partner leaning on shoulder */}
      <circle cx="178" cy="82" r="16" fill="#F3F0FA" stroke="#7568A8" strokeWidth="1.5" />
      <path
        d="M196 100c-14 0-24 10-26 24l-3 18h52l-3-18c-2-14-12-24-20-24z"
        fill="#8E7DBE"
        stroke="#5C5470"
        strokeWidth="1.2"
      />
      <path d="M188 84c2 2 6 2 9 0" stroke="#5C5470" strokeWidth="1.2" strokeLinecap="round" />

      {/* Shoulder lean connection */}
      <path
        d="M158 78c8-6 22-4 28 6"
        stroke="#7568A8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Shared blanket */}
      <path
        d="M108 134c24 10 80 10 104 0"
        stroke="#FAF8F7"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M108 134c24 10 80 10 104 0"
        stroke="#C9BBE0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Tea mug */}
      <rect x="248" y="116" width="22" height="16" rx="4" fill="#EDE8F4" stroke="#8E7DBE" strokeWidth="1" />
      <path d="M270 122h8c2 0 4 2 4 5v3" stroke="#7568A8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M254 110c0-5 4-8 8-8s8 3 8 8" stroke="#B59EDB" strokeWidth="1.5" strokeLinecap="round" />

      {/* Soft floor shadow */}
      <ellipse cx="160" cy="188" rx="96" ry="4" fill="#7568A8" opacity="0.15" />
    </svg>
  );
}
