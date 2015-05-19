var webpack = require("webpack");
var path = require("path");

module.exports = {
  eval: "source-map",
  entry: [
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
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
        loaders: ["react-hot", "babel-loader"]
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
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
