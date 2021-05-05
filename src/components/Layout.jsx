/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

/**
 * Component for main layout for any page in the application.
 *
 * @param children the children to display between the header and footer
 */
const Layout = (props) => {
  const { children, headerLogoURL, footerLogoURL } = props;

  return (
    <div>
      <Header logoUrl={headerLogoURL} />
      { children }
      <Footer logoUrl={footerLogoURL} />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  headerLogoURL: PropTypes.shape().isRequired,
  footerLogoURL: PropTypes.shape().isRequired,
};

export default Layout;
