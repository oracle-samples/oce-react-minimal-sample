/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
/* eslint-disable no-param-reassign */

import getDeliveryClient from './server-config-utils';

/*
 * Utility method to log an error.
 */
function logError(message, error) {
  if (error && error.statusMessage) {
    console.log(`${message} : `, error.statusMessage);
  } else if (error.error && error.error.code && error.error.code === 'ETIMEDOUT') {
    console.log(`${message} : `, error);
  } else if (error.error && error.error.code) {
    console.log(`${message} : `, error.error.code);
  } else if (error) {
    console.error(message, error);
  }
}

/**
 * Private method for adding the specified format rendition to the rendition string
 *
 * @param {Object} url - the url which contains the rendition strings
 * @param {Object} rendition - the rendition field of the content sdk json object
 * @param {String} formatstr - the format string type - either webp or jpg
 */
function addRendition(urls, rendition, formatstr) {
  // Get the webp format field
  const format = rendition.formats.filter((item) => item.format === `${formatstr}`)[0];
  const self = format.links.filter((item) => item.rel === 'self')[0];
  const url = self.href;
  const { width } = format.metadata;

  // Also save the jpg format so that it can be used as a default value for images
  if (formatstr === 'jpg') {
    urls[rendition.name.toLowerCase()] = url;
    urls.jpgSrcset += `${url} ${width}w,`;
  } else {
    urls.srcset += `${url} ${width}w,`;
  }
}

/**
 * Retrieve the sourceset for an asset that is constructed from the rendition
 *
 * @param {asset} client - the asset whose fields contain the various renditions
 * @returns {Object} - An Object containing the the sourceset as well as individual rendition
 * url that can be used as default src
 */
function getSourceSet(asset) {
  const urls = {};
  urls.srcset = '';
  urls.jpgSrcset = '';
  if (asset.fields && asset.fields.renditions) {
    asset.fields.renditions.forEach((rendition) => {
      addRendition(urls, rendition, 'jpg');
      addRendition(urls, rendition, 'webp');
    });
  }
  // add the native rendition to the srcset as well
  urls.srcset += `${asset.fields.native.links[0].href} ${asset.fields.metadata.width}w`;
  urls.native = asset.fields.native.links[0].href;
  urls.width = asset.fields.metadata.width;
  urls.height = asset.fields.metadata.height;
  return urls;
}

/**
 * Fetch the URLs for the specified named images.
 *
 * The data returned is a map of image name to image url.
 *
 * @param {DeliveryClient} client - the delivery client
 * @param {array} imageNames - Array of item names to get from the server
 * @returns {Promise({Object})} - A Promise containing the data
 */
export default function fetchImageURLs(imageNames) {
  const client = getDeliveryClient();
  // Build up the query predicate of the format :
  // 'name eq "name1" OR name eq "name2" OR name eq "name3"'
  let predicate = '';
  for (let i = 0; i < imageNames.length; i += 1) {
    if (i > 0) {
      predicate += ' OR ';
    }
    predicate += `name eq "${imageNames[i]}"`;
  }
  const queryString = `((${predicate}) AND type eq "Image")`;

  // Search for the items and get the Rendition URL for each item
  return client
    .queryItems({
      q: queryString,
      fields: 'all',
    })
    .then((result) => {
      const imageURLs = {};
      const { items } = result;
      for (let i = 0; i < items.length; i += 1) {
        const urls = getSourceSet(items[i]);
        imageURLs[items[i].name] = urls;
      }
      return imageURLs;
    })
    .catch((error) => logError('Fetching images failed', error));
}
