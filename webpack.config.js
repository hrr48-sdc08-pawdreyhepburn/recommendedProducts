const path = require('path');
const nodeExternals = require('webpack-node-externals');

const client = {
  entry: './client/src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './client/dist'),
  },
  mode: 'production',
  // watch: true,
  module: {
    rules: [
      {
        test: /\jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['babel-plugin-styled-components']
          }
        }
      }
    ]
  }
};

const server = {
  entry: './server',
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  output: {
    filename: 'serverBundle.js',
    path: path.resolve(__dirname, './server'),
  },
  mode: 'production',
  // watch: true,
  module: {
    rules: [
      {
        test: /\jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env',],
            plugins: ['babel-plugin-styled-components']
          }
        }
      }
    ]
  }
};

module.exports = [ client, server];