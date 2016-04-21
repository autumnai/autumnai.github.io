import React, {Component, PropTypes} from 'react';
import Router from 'react-router';

export default class Root extends Component {
    render() {
        return (
            <html>
              <head>
                <title>{this.props.title}</title>
              </head>
              <body>
                <div>{this.props.content}</div>
              </body>
            </html>
        );
    }
}

