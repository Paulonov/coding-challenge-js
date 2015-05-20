var path = require("path");

module.exports = {
  entry: [
    "./src/entry.jsx"
  ],
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, "src"),
        loader: "eslint-loader"
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, "styles"),
        loader: "style!css"
      },
      {
        test: /\.(jpg|png)$/,
        include: path.join(__dirname, "images"),
        loader: "url-loader"
      },
      { test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  },
  eslint: {
    emitWarning: true,
    emitError: true,
    failOnWarning: true,
    failOnError: true
  }
};
