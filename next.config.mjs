// next.config.mjs
import withImages from "next-images";

/** @type {import('next').NextConfig} */
const nextConfig = withImages({
  reactStrictMode: true,
  // 필요에 따라 추가 설정
});

export default nextConfig;
