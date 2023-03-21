/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Contains the Routes used in the Client and Server routers.
 */
import Page from './Page';
import People from './People';
// eslint-disable-next-line import/no-cycle
import App from './App';
import { fetchOceMinimalMain, fetchPage } from '../scripts/services';
import fetchPeople from '../scripts/services-graphql';

const routes = [
  {
    path: '/',
    component: App,
    fetchInitialData: () => fetchOceMinimalMain(),
  },
  {
    path: '/page/people',
    component: People,
    fetchInitialData: (path, hostUrl) => fetchPeople('people', hostUrl), // hostUrl gets passed only on serverside
    title: 'People',
  },
  {
    path: '/page/:slug',
    component: Page,
    fetchInitialData: (path) => fetchPage(path.split('/').pop()),
    title: 'Page',
  },
];

export default routes;
