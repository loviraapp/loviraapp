export function LoviraLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M24 38c-8-6-16-13-16-22a8 8 0 0 1 16-4 8 8 0 0 1 16 4c0 9-8 16-16 22Z"
        fill="#E8A0B4"
        fillOpacity="0.85"
      />
      <path
        d="M24 36c-7-5.5-14-12-14-20a7 7 0 0 1 14-3.5 7 7 0 0 1 14 3.5c0 8-7 14.5-14 20Z"
        fill="#9A84C4"
        fillOpacity="0.9"
      />
      <path
        d="M24 34c-5.5-4.5-11-9.5-11-16a5.5 5.5 0 0 1 11-2.75 5.5 5.5 0 0 1 11 2.75c0 6.5-5.5 11.5-11 16Z"
        fill="#C9BBE0"
      />
    </svg>
  );
}
