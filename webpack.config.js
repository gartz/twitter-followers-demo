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
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.name
    })
  ],
  debug: true,
  devtool: 'inline-source-map'
};