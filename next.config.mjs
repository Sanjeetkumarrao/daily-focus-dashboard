/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // development me false rakhna sahi rehta hai taki browser ise hard-cache na kare
      },
    ];
  },
};

export default nextConfig;




// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;
