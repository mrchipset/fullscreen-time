const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'extension'),
    filename: 'content.js',
    // sourceMapFilename: 'content.js.map'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { ascii_only: true },
        },
      }),
    ],
  },
};

module.exports = config;