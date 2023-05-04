/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "t0.gstatic.com",
            port: "",
        }]
    }
}

module.exports = nextConfig
