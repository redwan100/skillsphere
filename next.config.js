/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com", "utfs.io"],
    remotePatterns: [
      {
        protocol: "https" || "http", // or 'http'
        hostname: "https://img.clerk.com", // External domain (e.g., your image CDN or website)
        port: "", // (Optional) Specify a port if necessary
        pathname: "/images/**", // Specify the path for images on the external domain
      },
    ],
  },
};

module.exports = nextConfig;
