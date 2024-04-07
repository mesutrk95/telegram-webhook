/** @type {import('next').NextConfig} */

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const nextConfig = {
  images: { unoptimized: true },
  ...(process.env.UI_EXPORT_DIR && {
    distDir: process.env.UI_EXPORT_DIR,
    output: "export",
  }),
  ...(process.env.UI_BASE_URL && {
    basePath: process.env.UI_BASE_URL,
    assetPrefix: process.env.UI_BASE_URL,
  }),
};

export default nextConfig;
