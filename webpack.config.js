/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "web",
  devtool: "source-map",
  entry: "./dev/index.js",
  mode: "development",
  //stats: { warnings: false },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/,
        use: [],
      },
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".ts", ".json"] },
  output: {
    path: path.resolve(__dirname, "dist/dev/"),
    publicPath: "/dist/dev/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "dev/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/dev/",
    hotOnly: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  // ignoreWarnings: [/Failed to parse source map/],
};
