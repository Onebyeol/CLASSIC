import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.34', '192.168.0.36', '10.104.52.115'],
  devIndicators: false,
  turbopack: { root: __dirname },
};

export default nextConfig;
