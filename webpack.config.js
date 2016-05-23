'use strict';

//var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./front/js/app.js",
  output: {
    path: __dirname + '/public',
    filename: "build.js"
  },
  //
  //externals: {
  //  lodash: '_'
  //},

  watch: true,
  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      }

    ]
  }

  //plugins: [
  //  new webpack.optimize.UglifyJsPlugin({
  //    compress: {
  //      warnings: false
  //    }
  //  })
  //]

};

