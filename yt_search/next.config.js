/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    output: 'export',
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "i.ytimg.com",
            port: "",
        }]
    }
}

module.exports = nextConfig
