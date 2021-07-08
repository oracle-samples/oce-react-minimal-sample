/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Contains the Routes used in the Client and Server routers.
 */
import App from './App';
import Page from './Page';

export default [
  {
    ...App,
    routes: [
      {
        ...Page,
        path: '/:slug',
        exact: false,
        title: 'Page',
      },
    ],
  },
];
