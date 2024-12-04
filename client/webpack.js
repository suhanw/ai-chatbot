const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

console.log("bundling client");
console.log({ isDevelopment });

const config = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "inline-source-map" : false,
  stats: {
    errorDetails: isDevelopment,
  },
  target: "web",
  entry: path.resolve(__dirname, "./src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "client.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "./tsconfig.json"),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: isDevelopment
    ? {
        hot: false,
        liveReload: true,
        port: process.env.CLIENT_PORT || 8080,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    : undefined,
};

module.exports = config;
