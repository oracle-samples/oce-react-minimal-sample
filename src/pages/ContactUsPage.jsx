/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';
import fetchImageURLs from '../scripts/services';

import ConnectWithUs from '../components/ConnectWithUs';
import Locations from '../components/Locations';
import ImageWithText from '../components/ImageWithText';

/**
 * Component for the Contact Us page.
 */
class ContactUsPage extends React.Component {
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
      imageURL: mergedData ? mergedData[process.env.CONTACTUS_IMAGE_FILE_NAME] : '',
    };
  }

  // client side only : if this component doesn't already have its data, load it
  componentDidMount() {
    document.title = 'Contact';
    const { imageURL } = this.state;
    if (!imageURL) {
      this.fetchData();
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  fetchData() {
    fetchImageURLs([process.env.CONTACTUS_IMAGE_FILE_NAME])
      .then((data) => this.setState(() => ({
        imageURL: data[process.env.CONTACTUS_IMAGE_FILE_NAME],
      })));
  }

  render() {
    const { imageURL } = this.state;

    return (
      <div id="contactus-container">
        <ImageWithText
          backgroundImage={imageURL}
          mainTitle="Want to learn more?"
          subText="Find out more learning material on OCE Developer portal."
          buttonText="OCE FOR DEVELOPERS"
          buttonUrl="https://developer.oracle.com/"
        />
        <ConnectWithUs />
        <Locations />
      </div>
    );
  }
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData() {
  return fetchImageURLs([process.env.CONTACTUS_IMAGE_FILE_NAME]);
}

/*
 * Export an object with name value pairs of loadData function and component.
 */
export default {
  fetchInitialData,
  component: ContactUsPage,
};

ContactUsPage.propTypes = {
  staticContext: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

ContactUsPage.defaultProps = {
  staticContext: {},
};
