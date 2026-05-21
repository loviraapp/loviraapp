import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CycleAwareness } from "@/components/landing/cycle-awareness";
import { PartnerSupport } from "@/components/landing/partner-support";
import { Privacy } from "@/components/landing/privacy";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CycleAwareness />
      <PartnerSupport />
      <Privacy />
      <CtaSection />
      <LandingFooter />
    </>
  );
}
