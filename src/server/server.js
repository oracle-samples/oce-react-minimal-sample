/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * Entry point for the server side application.
 *
 * This is a simple Express Server.
 *
 * "webpack.server.config.js" is where this file is specified as the server side entry point.
 */
import 'core-js'; // replacement for babel-polyfill in babel 7.4 & above
import 'regenerator-runtime/runtime'; // replacement for babel-polyfill in babel 7.4 & above
import express from 'express';
import { matchRoutes } from 'react-router-config';
import Routes from '../pages/Routes';
import renderer from './renderer';

const server = express();

// open all the files/folders in the "public" directory to the outside world by telling Express
// to treat the "public" directory as a freely available public directory.
// so static assets can be served from ./public on the /public route.
server.use(express.static('public'));

// create a single route handler to listen to all (*) routes of our application
server.get('*', (req, res) => {
  // matchRoutes will return all the components which will be rendered as per the request route.
  // call "fetchInitialData" on each of those components (if the component has such a method),
  // and build up an array of pending network calls for all the data required for the components
  // which will be rendered.
  const promises = matchRoutes(Routes, req.path).map(({ route }) => (
    route.fetchInitialData ? route.fetchInitialData(req) : null));

  // Execute all promises at the same time to get all the data, once its all been obtained
  // render the HTML to the client by delgating to the "renderer" method
  Promise.all(promises).then((data) => {
    // this context object gets passed into the renderer, which in turn passes it
    // to the StaticRouter. The StaticRouter passes it to any component which is called
    // as the "staticContext" prop.
    const context = { data };

    // get the content to return to the client
    const content = renderer(req, context);

    // if the route requested was not found, the content object will have its "notFound"
    // property set, therefore we need to change the response code to a 404, not found
    if (context.notFound) {
      res.status(404);
    }

    // send the response
    res.send(content);
  });
});

const port = process.env.EXPRESS_SERVER_PORT || 8080;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
