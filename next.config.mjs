// Для project site: BASE_PATH=/имя-репозитория (например /wedding).
// Для user site (username.github.io): BASE_PATH не задавайте.
const basePath = process.env.BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Для Open Graph при сборке на CI (см. workflow «Set public site URL»)
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  },
  ...(basePath ? { basePath } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
