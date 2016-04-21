import React from 'react';
import { Router, Route, DefaultRoute } from  'react-router';
import Root from './components/Root.js';
import Index from './components/Index.js';

export default (
  <Route handler={Root} path='/'>
    <DefaultRoute handler={Index} />
  </Route>
)
