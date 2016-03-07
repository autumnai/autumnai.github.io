import Metalsmith from 'metalsmith';
import layouts from 'metalsmith-layouts';
import inPlace from 'metalsmith-in-place';
import markdown from 'metalsmith-markdown';
import sass from 'metalsmith-sass';
import htmlMinifier from 'metalsmith-html-minifier';
import googleAnalytics from 'metalsmith-google-analytics';
import babel from 'metalsmith-babel';
import Mwebpack from 'metalsmith-webpack';
import webpack from 'webpack';

Metalsmith(__dirname)
  //.use(babel())
  .use(sass({
    outputDir: 'css',
    sourceMapContents: true
  }))
  .use(markdown({
    gfm: true
  }))
  .use(layouts({
    engine: 'liquid',
    directory: 'layouts',
    includeDir: 'layouts/includes'
  }))
  .use(inPlace({
    engine: 'liquid',
    pattern: '**/*.html',
    includeDir: 'layouts/includes'
  }))
  .use(googleAnalytics('UA-46065410-1'))
  .use(Mwebpack({
    context: __dirname + '/src/js/',
    entry: {
      benchmarks: './benchmarks.js',
      index: './index.js',
    },
    output: {
      path: __dirname + '/build/js/',
      filename: '[name].js'
    },
    resolveLoader: {
      root: __dirname + '/node_modules',
      modulesDirectories: [(__dirname + "/node_modules")]
    },
    module: {
      loaders: [
        {
          loader: "babel",
          include: [
            __dirname + '/src',
          ],
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
  }))
  .use(htmlMinifier())
  .build(err => { if (err) { console.log(err) }});
