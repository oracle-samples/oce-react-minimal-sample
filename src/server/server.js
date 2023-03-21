/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
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
import http from 'http';
import https from 'https';
import { matchPath } from 'react-router';
import routes from '../pages/Routes';
import renderer from './renderer';
import getClient from '../scripts/server-config-utils';
import { fetchOceMinimalMain } from '../scripts/services';

const bodyParser = require('body-parser');

/*
 * Create an instance of an Express server
 */
const server = express();

/*
 * Open all the files/folders in the "public" directory to the outside world by telling Express
 * to treat the "public" directory as a freely available public directory. Static assets can
 * therefore be served from ./public on the /public route.
 */
server.use(express.static('public'));

// The bodyParser is needed since we need to get the req body for graphql queries
// server.use(cors());
server.use(express.static('dist'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
/*
 * Handle the proxy request.
 */
function handleContentRequest(req, res, authValue) {
  // build the URL to the real server
  let content = process.env.SERVER_URL.charAt(process.env.SERVER_URL.length - 1) === '/'
    ? 'content' : '/content';
  if (req.url.charAt(0) !== '/') {
    content = `${content}/`;
  }
  const oceUrl = `${process.env.SERVER_URL}${content}${req.url}`;

  // Add the authorization header
  const options = {};
  if (authValue) {
    options.headers = { Authorization: authValue };
  }
  options.method = req.method;

  // define a function that writes the proxied content to the response
  const writeProxyContent = (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    proxyResponse.pipe(res, {
      end: true,
    });
  };
  // based on whether the Content server is HTTP or HTTPS make the request to it
  const proxy = (oceUrl.startsWith('https'))
    ? https.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse))
    : http.request(oceUrl, options, (proxyResponse) => writeProxyContent(proxyResponse));
  if (req.method === 'POST') {
    proxy.write(JSON.stringify(req.body));
  }
  // Handling error event
  proxy.on('error', (err) => {
    console.log('Error in server.js while executing proxy request : ', err);
  });

  // write the proxied response to this request's response

  req.pipe(proxy, {
    end: true,
  });
}

/*
 * Route handler for requests to '/content/'.
 *
 * When authorization is needed for the calls to Oracle Content
 * - all image requests will be proxied through here regardless of server or client side rendering
 * - browser requests for content are proxied through here (server content requests will never be
 *   proxied)
 * - this server will pass on the call to Oracle Content adding on the authorization headers and
 *   returning the Oracle Content response.
 * This ensures the browser will never have the authorization header visible in its requests.
 *
 * See the following files where proxying is setup
 * - 'src/scripts/server-config-utils.getClient' for the code proxying requests for content
 */
server.use('/content/', (req, res) => {
  const client = getClient();
  client.getAuthorizationHeaderValue().then((authValue) => {
    handleContentRequest(req, res, authValue);
  });
});

/*
 * Create a single route handler to listen to all (*) routes of our application
 */
server.get('*', (req, res) => {
  // matchPath will return the component which will be rendered as per the request route.
  // call "fetchInitialData" on that component (if the component has such a method),
  // and build up an array of pending network calls for all the data required for the components
  // which will be rendered.
  const promises = [];
  const activeRoute = routes.find((route) => matchPath(route.path, req.url)) || null;
  if (activeRoute && activeRoute.fetchInitialData) {
    const hostUrl = `${req.protocol}://${req.headers.host}`;
    if (req.url !== '/') {
      promises.push(fetchOceMinimalMain());
    }
    promises.push(activeRoute.fetchInitialData(req.path, hostUrl));
  }
  // Execute all promises at the same time to get all the data, once its all been obtained
  // render the HTML to the client by delegating to the "renderer" method
  Promise.all(promises).then((data) => {
    if (req.url === '/') {
      const { fields } = data[0];
      const [firstPage] = fields.pages;
      const firstPageSlug = firstPage.slug;
      const url = `/page/${firstPageSlug}`;
      res.redirect(301, url);
    } else {
      // this data object gets passed into the renderer which then
      // returns the content to send back to the client
      const content = renderer(req, data);
      // send the response
      res.send(content);
    }
  });
});

/*
 * Set the port the Express server is listening on
 */
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Application is accesssible on : http://localhost:${port}`);
});
