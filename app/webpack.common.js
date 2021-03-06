const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  name: "site",
  entry: ["@babel/polyfill", path.resolve(__dirname, "src/index.jsx")],
  resolve: {
    alias: {
      react: path.resolve("../node_modules/react"),
      parchment$: path.resolve("../node_modules/parchment/src/parchment.ts"),
      "quill/": path.resolve("../node_modules/quill/"),
    },
    extensions: [".jsx", ".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/react"],
            plugins: [
              "syntax-dynamic-import",
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false,
                target: "es5",
                module: "commonjs",
              },
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [{ loader: "text-loader" }, { loader: "markdown-loader" }],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.tsv$/,
        loader: "raw-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: `${__dirname}/index.html`,
      filename: "index.html",
    }),
  ],
};
