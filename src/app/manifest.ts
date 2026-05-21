import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lovira",
    short_name: "Lovira",
    description:
      "Couple wellness with cycle awareness, mood check-ins, and partner support.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f5",
    theme_color: "#b85a75",
  };
}
