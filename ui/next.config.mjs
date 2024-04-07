/** @type {import('next').NextConfig} */

import dotenv from 'dotenv';

dotenv.config({path: '../.env'})

const nextConfig = {
  images: { unoptimized: true },
  output: "export", 
  ...(process.env.EXPORT_UI_DIR && { distDir: "../dist" }),

};

export default nextConfig;
