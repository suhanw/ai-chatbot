const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
  entry: {
    client: path.resolve(__dirname, "./src/index.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "client" + (isDevelopment ? "" : ".[contenthash]") + ".js",
    publicPath: process.env.CDN_URL,
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
  plugins: [
    new WebpackManifestPlugin({
      fileName: "manifest.json",
      // https://github.com/shellscape/webpack-manifest-plugin?tab=readme-ov-file#isinitial
      // isInitial is true for the main entrypoint and false for all other chunks
      filter: (file) => file.isInitial, 
      writeToFileEmit: true, // write to `dist` for server to consume
    }),
    new CopyPlugin({
      // copy static files to dist
      patterns: [
        {
          from: path.resolve(__dirname, "./static"),
          to: path.resolve(__dirname, "../dist"),
        },
      ],
    }),
  ],
  devServer: isDevelopment
    ? {
        hot: false,
        liveReload: true,
        port: process.env.CLIENT_PORT,
        allowedHosts: "all",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        static: path.resolve(__dirname, "./static"),
      }
    : undefined,
};

module.exports = config;
