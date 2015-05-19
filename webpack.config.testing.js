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
        loader: "eslint-loader"
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, "src"),
          path.join(__dirname, "test")
        ],
        loaders: [
          "coverjs-loader",
          "babel-loader"
        ]
      },
      {
        test: /\.css$/,
        include: [
          path.join(__dirname, "styles"),
          path.join(__dirname, "node_modules/coverjs-loader/")
        ],
        loader: "style-loader!css-loader"
      }
    ]
  }
};
