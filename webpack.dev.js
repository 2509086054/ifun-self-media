const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  node: { fs: 'empty' },
  devtool: 'cheap-module-source-map', // 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    quiet: true, // lets WebpackDashboard do its thing
    hot: true // 模块热替换(hot module replacement 或 HMR)
  }
});
