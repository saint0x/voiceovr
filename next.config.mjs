// next.config.mjs
export default {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/home",
          permanent: true,
        },
      ];
    },
  };
  