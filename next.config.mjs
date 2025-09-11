/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "refind66091c0821a8489db49f16b2384bf22778a18-staging.s3.ap-northeast-3.amazonaws.com",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "refind66091c0821a8489db49f16b2384bf227169f7-main.s3.ap-northeast-3.amazonaws.com",
                pathname: "/**"
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
