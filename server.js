const process = require('process');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const tweetserver = require('tweetserver/lib/app');

var compiler = webpack(webpackConfig);
var server = new WebpackDevServer(compiler, {
  // webpack-dev-server options

  contentBase: webpackConfig.output.path,

  hot: true,
  historyApiFallback: false,
  compress: false,

  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  lazy: true,
  filename: webpackConfig.output.filename,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: { colors: true }
});
server.listen(8000, "localhost", function() {});
tweetserver({
  port: 8001,
  auth: {
    accessToken: process.env.TFD_ACCESS_TOKEN,
    accessSecret: process.env.TFD_ACCESS_SECRET,
    consumerKey: process.env.TFD_CONSUMER_KEY,
    consumerSecret: process.env.TFD_CONSUMER_SECRET
  }
});