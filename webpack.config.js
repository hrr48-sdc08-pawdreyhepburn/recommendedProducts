const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './client/dist'),
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  }
};