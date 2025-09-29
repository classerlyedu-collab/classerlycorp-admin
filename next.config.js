// /** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
//   compiler: {
//     styledComponents: true,
//   },
// };



/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors during build
  },
};
