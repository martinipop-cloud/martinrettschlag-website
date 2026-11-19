import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Größen und moderne Formate rechnet das Sanity-CDN aus, nicht die
    // Bildoptimierung von Vercel – die ist im kostenlosen Tarif begrenzt
    // (N-02). Siehe src/lib/bild-loader.ts.
    loader: "custom",
    loaderFile: "./src/lib/bild-loader.ts",
  },
};

export default nextConfig;
