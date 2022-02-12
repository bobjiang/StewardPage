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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: "csv-loader",
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    });

    return config;
  },
};
