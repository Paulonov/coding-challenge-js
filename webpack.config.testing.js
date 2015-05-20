var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: "./src/entry.jsx",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, "src"),
          path.join(__dirname, "test")
        ],
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, "src")
        ],
        exclude: /node_modules/,
        loader: "coverjs-loader"
      },
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, "src"),
          path.join(__dirname, "test")
        ],
        exclude: /node_modules/,
        loader:
          "babel-loader"
      },
      {
        test: /\.css$/,
        include: [
          path.join(__dirname, "styles"),
          path.join(__dirname, "node_modules/coverjs-loader/")
        ],
        loader: "style!css"
      },
      {
        test: /\.(jpg|png)$/,
        include: path.join(__dirname, "images"),
        loader: "url-loader"
      },
      {
        test: /\.json$/,
        include: [
          path.join(__dirname, "")
        ],
        loader: "json"
      },
      {
        test: /\.node$/,
        include: [
          path.join(__dirname, "node_modules/canvas/build/Release/")
        ],
        loader: "node"
      },
      { test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  }
};
