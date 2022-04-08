/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
/* eslint-disable no-param-reassign */

/**
 * This file contains a number of utility methods used to obtain data
 * from the server using the Oracle Content SDK JavaScript Library.
 */

import fetch from 'cross-fetch';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from '@apollo/client';

/**
 * Constants used in this file
 */
const SERVER_URL_GRAPHQL = `${process.env.SERVER_URL}/content/published/api/v1.1/graphql`;
const GET_PEOPLE_PAGE = gql`
  query ($peopleSlug: String!, $channelToken: String!){
    getPeoplePage(slug: $peopleSlug, channelToken: $channelToken) {
      id
      slug
      name
      fields {
        announcement {
          id
          fields {
            type: fieldType
            heading
            body
            actions
            image {
              ...sectionImages
            }
          }
        }
        people {
          id
          fields {
            fullname
            title
            biodata
            file {
              metadata {
                width
                height
              }
            }
            renditions {
              name
              format
              file {
                url
                metadata {
                  height
                  width
                }
              }
            }
          }
        }
      }
    }
  }
  fragment sectionImages on image {
    id
    fields {
      file {
        metadata {
          width
          height
        }
      }
      renditions {
        name
        format
        file {
          url
          metadata {
            height
            width
          }
        }
      }
    }
  }`;

/**
 * Private method for adding the specified format rendition to the rendition string
 *
 * @param {Object} url - the url which contains the rendition strings
 * @param {Object} rendition - the rendition field of the content sdk json object
 * @param {String} formatstr - the format string type - either webp or jpg
 */
function addRenditionGraphQL(urls, rendition) {
  // Get the webp format field
  const { format } = rendition;
  const { url } = rendition.file;
  const { width } = rendition.file.metadata;

  // Also save the jpg format so that it can be used as a default value for images
  if (format === 'jpg') {
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
function getSourceSetGraphQL(asset) {
  const urls = {};
  urls.srcset = '';
  urls.jpgSrcset = '';
  if (asset.fields && asset.fields.renditions) {
    asset.fields.renditions.forEach((rendition) => {
      addRenditionGraphQL(urls, rendition);
    });
  }
  // No native rendition to add to the srcset in graphql
  // urls.srcset += `${asset.fields.native.links[0].href} ${asset.fields.metadata.width}w`;
  // urls.native = asset.fields.native.links[0].href;
  urls.width = asset.fields.file.metadata.width;
  urls.height = asset.fields.file.metadata.height;
  return urls;
}

/**
 * Fetch the specified page content type given its slug
 *
 * @param {string} slug - the page slug whose details are to be obtained
 * @returns {Promise({Object})} - A Promise containing the data
 */
export default async function fetchPeople(peopleSlug) {
  // Get the page details
  const channelToken = `${process.env.CHANNEL_TOKEN}`;
  const client = new ApolloClient(
    {
      link: new HttpLink({ uri: SERVER_URL_GRAPHQL, fetch }),
      cache: new InMemoryCache(),
    },
  );
  const page = await client.query({
    query: GET_PEOPLE_PAGE,
    variables: { peopleSlug, channelToken },
  });
  // copy the object as in ssr mode, we get a
  // TypeError: Cannot add property renditionURLs, object is not extensible
  const pageData = process.env.IS_BROWSER
    ? page.data.getPeoplePage
    : JSON.parse(JSON.stringify(page.data.getPeoplePage));
  const { people, announcement } = pageData.fields;
  if (announcement.fields.image) {
    announcement.renditionURLs = getSourceSetGraphQL(announcement.fields.image);
  }
  if (people) {
    people.forEach((person) => {
      person.renditionURLs = getSourceSetGraphQL(person);
    });
  }
  return pageData;
}
