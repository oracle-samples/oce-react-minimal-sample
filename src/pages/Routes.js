/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Contains the Routes used in the Client and Server routers.
 */
import App from './App';
import HomePage from './HomePage';
import ContactUsPage from './ContactUsPage';
import NotFoundPage from './NotFoundPage';

export default [
  {
    ...App,
    routes: [
      {
        ...HomePage,
        path: '/',
        exact: true,
        title: 'Home',
      },
      {
        ...ContactUsPage,
        path: '/contact',
        exact: true,
        title: 'contact',
      },
      {
        ...NotFoundPage,
      },
    ],
  },
];
