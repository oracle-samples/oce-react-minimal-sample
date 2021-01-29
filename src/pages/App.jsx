/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import fetchImageURLs from '../scripts/services';

/**
 * The main application component which wraps each page of the application
 * with a header and footer.
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    let data;
    if (process.env.IS_BROWSER) {
      data = window.INITIAL_DATA;
      // Do not delete the data yet, as the HomePage/ContactUs page need to read from it
      // delete window.INITIAL_DATA;
    } else {
      const { staticContext } = this.props;
      data = staticContext.data;
    }

    // The data will be an array containing one object with the URLs from the
    // this component and another object with the URLs from HomePage/ContactUsPage component.
    // Flatted into a single object to make it easier to pull out the data we need.
    const mergedData = data ? Object.assign(...data) : {};

    this.state = {
      headerLogoURL: mergedData ? mergedData[process.env.LOGO_FILE_NAME] : '',
      footerLogoURL: mergedData ? mergedData[process.env.FOOTER_LOGO_FILE_NAME] : '',
    };
  }

  // client side only : if this component doesn't already have its data, load it
  componentDidMount() {
    const { headerLogoURL, footerLogoURL } = this.state;
    if (!headerLogoURL || !footerLogoURL) {
      this.fetchData();
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData() {
    fetchImageURLs([process.env.LOGO_FILE_NAME, process.env.FOOTER_LOGO_FILE_NAME])
      .then((data) => this.setState(() => ({
        headerLogoURL: data[process.env.LOGO_FILE_NAME],
        footerLogoURL: data[process.env.FOOTER_LOGO_FILE_NAME],
      })));
  }

  render() {
    const { headerLogoURL, footerLogoURL } = this.state;
    const { route } = this.props;

    return (
      <div>
        <Layout headerLogoURL={headerLogoURL} footerLogoURL={footerLogoURL}>
          {renderRoutes(route.routes)}
        </Layout>
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData() {
  return fetchImageURLs([process.env.LOGO_FILE_NAME, process.env.FOOTER_LOGO_FILE_NAME]);
}

/*
 * Export an object with name value pairs of loadData function and component.
 */
export default {
  fetchInitialData,
  component: App,
};

App.propTypes = {
  staticContext: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
  route: PropTypes.shape({
    routes: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

App.defaultProps = {
  staticContext: {},
};
