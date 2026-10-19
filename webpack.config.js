const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'extension'),
      filename: 'content.js'
    },
    // Development keeps an inline map for debugging. Production ships no
    // source map at all (neither external nor inline).
    devtool: isProduction ? false : 'inline-source-map',
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
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: { ascii_only: true }
          }
        })
      ]
    }
  };
};
