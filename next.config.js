/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/delegate/vote": { page: "/delegate/vote" },
    };
  },
};
