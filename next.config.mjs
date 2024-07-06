import dotenv from "dotenv";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      syncWebAssembly: true,
      layers: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/sync",
    });

    config.plugins.push(new NodePolyfillPlugin());

    return config;
  },
};

export default nextConfig;
