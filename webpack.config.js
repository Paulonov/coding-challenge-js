var path = require("path");
module.exports = {
  entry: "./src/entry.jsx",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    preLoaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "eslint-loader" }
    ],
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};