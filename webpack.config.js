var path = require("path");
module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "eslint-loader" }
        ],
        loaders: [
            { test: /\.js$/, exclude: [/node_modules/, /test/, /core.js/, /graphics.js/], loader: "coverjs-loader" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    }
};