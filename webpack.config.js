const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_PATH = path.join(__dirname, 'build');

module.exports = {
  entry: './src/index.js',
  output: {
    path: BUILD_PATH,
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name
    })
  ]
};