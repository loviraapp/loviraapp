/**
 * Primary Lovira onboarding hero — full cinematic artwork asset.
 * Replace public/images/lovira-intro-hero.png with your reference file to swap art.
 */

const HERO_SRC = "/images/lovira-intro-hero.png";

type IntroHeroImageProps = {
  className?: string;
};

export function IntroHeroImage({ className = "" }: IntroHeroImageProps) {
  return (
    <div className={`intro-home-art-frame ${className}`}>
      {/* Native img — full-quality static asset, avoids optimizer edge cases on large PNGs */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_SRC}
        alt="A couple sharing a warm, cozy evening together at home"
        width={1024}
        height={1024}
        decoding="async"
        fetchPriority="high"
        className="intro-home-artwork"
      />
    </div>
  );
}
