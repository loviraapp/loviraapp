"use client";

type OnboardingShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function OnboardingShell({ children, className = "" }: OnboardingShellProps) {
  return (
    <div className={`onboarding-shell min-h-dvh ${className}`}>{children}</div>
  );
}
