var path = require('path');
module.exports = {
    entry: 'mocha!./src/entry.jsx',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: path.join(__dirname, 'src'), exclude: /node_modules/, loader: 'babel-loader' }
        ]
    }
};