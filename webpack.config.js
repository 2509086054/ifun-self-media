var path = require('path');
var DEBUG = process.env.NODE_ENV !== 'production';
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/monalisa/entry.js']
    // index: ['./src/bideo.js/main.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [new copyWebpackPlugin([{ from: './src/assets', to: 'assets' }])],
  resolve: {
    alias: {
      createjs: path.resolve(__dirname, './src/utils/createjs.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'index.html'
          }
        }
      },
      {
        test: /\.(png|jpg|gif|ico|svg|pvr|pkm|wav|mp3|webm|jpe?g)$/,
        // use: ['file-loader?name=[path][name].[ext]']
        use: 'file-loader'
      },
      {
        test: /\.(shader|vert|frag|geom)$/i,
        use: 'raw-loader'
      }
    ]
  },
  node: { fs: 'empty' },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8080,
    host: '0.0.0.0'
  },
  devtool: DEBUG ? 'cheap-module-source-map' : false
};
