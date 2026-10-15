import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bilder aus dem CMS werden über das Sanity-CDN ausgeliefert und von
    // Next.js automatisch in moderne Formate und passende Größen umgewandelt (N-02).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // YouTube-Vorschaubilder für Videos ohne eigenes Standbild. Der eigene
      // Server holt sie ab, Besucher haben keinen Kontakt zu Google.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
