import Metalsmith from 'metalsmith';
import layouts from 'metalsmith-layouts';
import inPlace from 'metalsmith-in-place';
import markdown from 'metalsmith-markdown';
import sass from 'metalsmith-sass';
import htmlMinifier from 'metalsmith-html-minifier';
import googleAnalytics from 'metalsmith-google-analytics';

Metalsmith(__dirname)
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
  .use(htmlMinifier())
  .build(err => { if (err) { console.log(err) }});
