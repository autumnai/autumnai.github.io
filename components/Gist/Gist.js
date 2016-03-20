import React, { Component, PropTypes } from 'react';

export default class Gist extends Component {

  render() {
    return <script src={this.props.src} charset="utf-8"></script>;
  }
}
