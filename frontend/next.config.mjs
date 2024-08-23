/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/',
            destination: 'http://localhost:3000',
          },
        ]
    }
};

export default nextConfig;
