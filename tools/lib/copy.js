/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import ncp from 'ncp';

export default (source, dest) => new Promise((resolve, reject) => {
  // copy leaf book to /static folder
  ncp('/home/mj/leaf/doc/book', 'static/leaf/book', err => err ? reject(err) : resolve());
  ncp(source, dest, err => err ? reject(err) : resolve());
});
