"use client";

import { useRouter } from "next/navigation";

type SupportPreferencesEditorProps = {
  onClose: () => void;
};

export function SupportPreferencesEditor({ onClose }: SupportPreferencesEditorProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 pb-4">
      <p className="text-sm text-muted">
        Update names, care preferences, and how Lovira supports you both.
      </p>
      <button
        type="button"
        onClick={() => {
          onClose();
          router.push("/onboarding");
        }}
        className="w-full rounded-full bg-primary/10 py-3 text-sm font-medium text-primary"
      >
        Open couple setup
      </button>
      <button type="button" onClick={onClose} className="w-full text-sm text-muted">
        Cancel
      </button>
    </div>
  );
}
