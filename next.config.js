/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '주소',
  },
}

module.exports = nextConfig

