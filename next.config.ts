import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {

    remotePatterns: [

      {

        protocol: "https",

        hostname: "api.dicebear.com",

      },

    ],

  },

};

export default withPWA({

  dest: "public",

  register: true,

  skipWaiting: true,

  disable:
    process.env.NODE_ENV ===
    "development",

  customWorkerDir:
    "worker",

})(nextConfig);