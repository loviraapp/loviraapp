"use client";

import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/role";
import { SupportPreferencesFlow } from "@/components/onboarding/support-preferences-flow";

type SupportPreferencesEditorProps = {
  role: UserRole;
  onClose: () => void;
};

export function SupportPreferencesEditor({
  role,
  onClose,
}: SupportPreferencesEditorProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 pb-4">
      <p className="text-sm text-muted">
        Update what helps you feel supported — your partner sees this through
        gentle suggestions, not scores.
      </p>
      <SupportPreferencesFlow
        role={role}
        onComplete={() => {
          onClose();
          router.refresh();
        }}
      />
      <button
        type="button"
        onClick={onClose}
        className="w-full text-sm text-muted"
      >
        Cancel
      </button>
    </div>
  );
}
