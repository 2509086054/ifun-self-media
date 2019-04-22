const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production', // 设置 production mode 配置后，webpack v4+ 会默认压缩你的代码
  devtool: false, // 'source-map',
  /* 放在 minimizer 项下，文件尺寸变大很多
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        include: path.resolve(__dirname, 'src'),
        exclude: /(\/node_modules\/|\/nouse\/)/i, // [/node_modules/,/bideo/],
        parallel: 4, // Boolean|Number,默认：false,默认并发运行数：os.cpus().length - 1
        extractComments: false // 禁用提取注释
        // sourceMap: true // 让 uglifyjs 的警告能够对应到正确的代码行
      })
    ]
  },*/
  plugins: [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      include: path.resolve(__dirname, 'src'),
      exclude: /(\/node_modules\/|\/nouse\/)/i, // [/node_modules/,/bideo/],
      parallel: 4, // Boolean|Number,默认：false,默认并发运行数：os.cpus().length - 1
      extractComments: false, // 禁用提取注释
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        },
        compress: {
          warnings: false
        }
      },
      cache: true
    })
  ]
});
