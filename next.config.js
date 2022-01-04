/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/vote": { page: "/vote" },
      "/delegate/vote": { page: "/delegate/vote" },
    };
  },
};
