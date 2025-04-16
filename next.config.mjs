import createJiti from 'jiti';
import { fileURLToPath } from 'node:url';
const jiti = createJiti(fileURLToPath(import.meta.url));

const withBundleAnalyzerImport = import('@next/bundle-analyzer').then((mod) =>
  mod.default({
    enabled: process.env.ANALYZE === 'true',
  }),
);

jiti('./env.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default async function getConfig() {
  const withBundleAnalyzer = await withBundleAnalyzerImport;
  return withBundleAnalyzer(nextConfig);
}
