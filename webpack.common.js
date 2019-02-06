const webpack = require('webpack');
const path = require('path');
const buildFolder = 'dist';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.js'
  },
  output: {
    filename: 'konsoru.js',
    path: path.resolve(__dirname, buildFolder),
    library: 'konsoru'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

