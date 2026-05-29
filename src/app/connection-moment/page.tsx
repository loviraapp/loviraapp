import { Suspense } from "react";
import { ConnectionMomentFlow } from "@/components/connection-moment/connection-moment-flow";

export const metadata = {
  title: "Together Mode",
  description: "Phones down. One intentional moment together.",
};

function TogetherFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-muted">
      Loading…
    </div>
  );
}

export default function ConnectionMomentPage() {
  return (
    <Suspense fallback={<TogetherFallback />}>
      <ConnectionMomentFlow />
    </Suspense>
  );
}
