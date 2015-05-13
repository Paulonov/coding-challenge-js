var path = require('path');
module.exports = {
    entry: './src/entry.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "eslint-loader" }
        ],
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};