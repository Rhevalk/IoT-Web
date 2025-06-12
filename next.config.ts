import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true, // aktifkan LightningCSS
  },
  env: {
    LIGHTNINGCSS_FORCE_WASM: "true", // paksa pakai WASM
  },
};

export default nextConfig;
