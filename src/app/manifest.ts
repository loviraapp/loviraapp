import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lovira",
    short_name: "Lovira",
    description:
      "Emotional wellness for couples — check-ins, insights, and gentle partner support.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ef",
    theme_color: "#4d6b5a",
  };
}
