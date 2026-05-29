import { MvpOnboardingFlow } from "@/components/onboarding/mvp-onboarding-flow";

type PageProps = { params: Promise<{ code: string }> };

export default async function InvitePage({ params }: PageProps) {
  const { code } = await params;
  return (
    <main className="min-h-dvh bg-background">
      <MvpOnboardingFlow inviteCode={code.toUpperCase()} />
    </main>
  );
}
