import React from 'react'
import { render } from 'react-dom'
import Router from 'react-router'
import Routes from './Routes.js'

export default function render(locals, callback) {
  Router.run(Routes, locals.path, function (Handler) {
    var html = React.renderToStaticMarkup(React.createElement(Handler, locals))
    callback(null, '<!DOCTYPE html>' + html)
  })
}
