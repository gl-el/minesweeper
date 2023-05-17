const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target: 'web',
  entry: path.resolve(__dirname, 'minesweeper', 'src', 'index.js'),
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'script.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: 'minesweeper/src/favicon.ico',
      inject: 'body',
      template: path.resolve(__dirname, 'minesweeper', 'src', 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ico$/i,
        type: 'asset/resource',
      },
      {
        test: /\.wav$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
