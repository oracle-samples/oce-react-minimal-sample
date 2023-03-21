/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
// eslint-disable-next-line import/no-cycle
import routes from './Routes';

/**
 * The main application component which wraps each page of the application
 * with a header and footer.
 */
export default function App({ serverData = null }) {
  let appData;
  if (process.env.IS_BROWSER) {
    appData = window.INITIAL_DATA;
  } else {
    // serverData gets passed in only when its SSR. The data passed is an array, the first element
    // of which contains the data to render the header and hooter and pages.
    appData = serverData;
  }
  const [data] = appData;
  if (!data) return null;
  const { footerRenditionURLs } = data;
  return (
    <div>
      <Helmet>
        <meta name="BUILD_TAG" content={`${process.env.BUILD_TAG}`} />
        <meta name="@oracle/content-management-sdk" content={`${process.env.SDK_VERSION}`} />
      </Helmet>
      <Header pages={data.fields.pages} headerRenditionURLs={data.headerRenditionURLs} />
      <Routes>
        {routes.map(({
          path, fetchInitialData, component: C, title,
        }) => (
          <Route
            key={path}
            path={path}
            // eslint-disable-next-line max-len
            element={<C serverData={serverData} fetchInitialData={fetchInitialData} title={title} />}
          />
        ))}
      </Routes>
      <Footer footerRenditionURLs={footerRenditionURLs} />
    </div>
  );
}

App.propTypes = {
  serverData: PropTypes.arrayOf(PropTypes.shape()),
};
App.defaultProps = {
  serverData: [],
};
