import React, { PropTypes } from 'react';
import './Layout.scss';

function Layout({ children }) {
  return (
    <div className="Layout">
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
