const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "web",
  devtool: "source-map",
  entry: "./dev/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".tsx", ".ts", ".json"] },
  output: {
    path: path.resolve(__dirname, "dist/dev/"),
    publicPath: "/dist/dev/",
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dev/"),
    },
    port: 3000,
    devMiddleware: {
      publicPath: "http://localhost:3000/dist/dev/",
    },
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
