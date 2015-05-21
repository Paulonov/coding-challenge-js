/**
 * server.js
 *
 * Used for testing the application using React and CSS hot loading with the npm run react-hot command.
 */
"use strict";

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config.hot-reload");

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true },
  historyApiFallback: true
}).listen(8080, "localhost", function (err, result) {

  if (err) {
    console.log(err);
  }

  console.log("Listening at localhost:8080");

});
