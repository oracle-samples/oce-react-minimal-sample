/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Contains the Routes used in the Client and Server routers.
 */
import App from './App';
import Page from './Page';
import People from './People';

export default [
  {
    ...App,
    path: '/',
    routes: [
      {
        ...People,
        path: '/page/people',
        exact: true,
        title: 'People',
      },
      {
        ...Page,
        path: '/page/:slug',
        exact: true,
        title: 'Page',
      },
    ],
  },
];
