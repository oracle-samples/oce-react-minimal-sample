/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import { fetchOceMinimalMain } from '../scripts/services';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Error from '../components/Error';

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
      // Do not delete the data yet, as the Page component needs to read from it
    } else {
      const { staticContext } = this.props;
      data = staticContext.data;
    }

    this.state = {
      appData: data,
    };
  }

  render() {
    const { appData } = this.state;
    const [data] = appData; // appData is an array. Fetch the first item in the array
    if (data.hasError) {
      return (
        <Error errorObj={data} />
      );
    }
    const { route, location } = this.props;
    const { footerRenditionURLs, fields } = data;
    const { pathname } = location;
    const isRoot = pathname === '/';
    const [firstPage] = fields.pages;
    const firstPageSlug = firstPage.slug;
    return (
      <div>
        <Header pages={data.fields.pages} headerRenditionURLs={data.headerRenditionURLs} />
        {isRoot ? (
          <Redirect to={{ pathname: `/page/${firstPageSlug}` }} />
        ) : (
          renderRoutes(route.routes)
        )}
        <Footer footerRenditionURLs={footerRenditionURLs} />
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData() {
  return fetchOceMinimalMain();
}

/*
 * Export an object with name value pairs of fetchInitialData function and component.
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
  location: PropTypes.shape().isRequired,
};

App.defaultProps = {
  staticContext: {},
};
