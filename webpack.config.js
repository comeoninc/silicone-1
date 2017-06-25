const { CheckerPlugin } = require('awesome-typescript-loader')
const BabiliPlugin = require("babili-webpack-plugin");
const path = require('path');

const base = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ]
};

const umd = (suffix = '.umd') => ({
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `silicone${suffix}.js`,
    library: 'Silicone',
    libraryTarget: 'window'
  },
});

const cjs = (suffix = '') => ({
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `silicone${suffix}.js`,
    libraryTarget: "commonjs2"
  },
});

const minified = {
  plugins: [
    new BabiliPlugin()
  ]
};

module.exports = [
  Object.assign({}, base, umd()),
  Object.assign({}, base, cjs()),
  //Object.assign({}, base, umd('.umd.min'), minified),
  //Object.assign({}, base, cjs('.min'), minified),
];