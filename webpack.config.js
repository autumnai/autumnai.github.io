var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
var webpack = require('webpack')
var data = require('./data')

module.exports = {
    entry: __dirname + '/entry.js',

    output: {
      filename: 'bundle.js',
      path: __dirname,
      libraryTarget: 'umd'
    },


    resolveLoader: {
      modulesDirectories: [(__dirname + "/node_modules")]
    },

    module: {
      loaders: [
        {
          loader: "babel",
          include: [
            __dirname + '/',
          ],
          exclude : [
            'node_modules',
            'build'
          ],
          query: {
            presets: ['es2015', 'react']
          }
        },
        { test: /\.jsx$/, loader: 'jsx-loader' }
      ]
    },

    plugins: [
      new webpack.ProvidePlugin({
        fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      }),
      new webpack.optimize.DedupePlugin(),
      new StaticSiteGeneratorPlugin('bundle.js', data.routes, data),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
}
