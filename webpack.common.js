const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/monalisa/entry.js']
    // index: ['./src/bideo.js/main.js']
  },
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new copyWebpackPlugin([{ from: './src/assets', to: 'assets' }])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(\/node_modules\/|\/nouse\/)/i, // [/node_modules/,/bideo/],
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
  }
};
