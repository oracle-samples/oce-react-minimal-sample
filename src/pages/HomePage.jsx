/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import PropTypes from 'prop-types';
import fetchImageURLs from '../scripts/services';

import Welcome from '../components/Welcome';
import ImageWithText from '../components/ImageWithText';

/**
 * Component for the Home page.
 */
class HomePage extends React.Component {
  constructor(props) {
    super(props);

    let data;
    if (process.env.IS_BROWSER) {
      data = window.INITIAL_DATA;
      delete window.INITIAL_DATA;
    } else {
      const { staticContext } = this.props;
      data = staticContext.data;
    }

    // The data will be an array containing one object with the URLs from the
    // App component and another object with the URLs from this component.
    // Flatted into a single object to make it easier to pull out the data we need.
    const mergedData = data ? Object.assign(...data) : {};

    this.state = {
      imageURL: mergedData ? mergedData[process.env.HOME_IMAGE_FILE_NAME] : '',
    };
  }

  // client side only : if this component doesn't already have its data, load it
  componentDidMount() {
    document.title = 'Home';

    const { imageURL } = this.state;
    if (!imageURL) {
      this.fetchData();
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData() {
    fetchImageURLs([process.env.HOME_IMAGE_FILE_NAME])
      .then((data) => this.setState(() => ({
        imageURL: data[process.env.HOME_IMAGE_FILE_NAME],
      })));
  }

  render() {
    const { imageURL } = this.state;
    return (
      <div id="home-container">
        <ImageWithText
          backgroundImage={imageURL}
          mainTitle="Want to use OCE with your Headless implementation?"
          subText="Try out OCE Samples, these are tutorials that explain how simple it is to use OCE with your Headless Experience."
        />
        <Welcome />
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData() {
  return fetchImageURLs([process.env.HOME_IMAGE_FILE_NAME]);
}

/*
 * Export an object with name value pairs of loadData function and component.
 */
export default {
  fetchInitialData,
  component: HomePage,
};

HomePage.propTypes = {
  staticContext: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

HomePage.defaultProps = {
  staticContext: {},
};
