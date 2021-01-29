/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for an Image with overlaid text and optionally a button.
 *
 * @param mainTitle the main text
 * @param subText the sub text
 * @param buttonText the text for the button,
 *                   null if no button is to be displayed
 * @param buttonUrl the URL for where the button should take the user when clicked
 *                  null if no button is to be displayed
 * @param backgroundImage the URL of the image to display in the background
 */
const ImageWithText = (props) => {
  // values passed into this component
  const {
    mainTitle, subText, buttonText, buttonUrl, backgroundImage,
  } = props;

  // determined styles
  const textClassNames = buttonText ? 'text adjust-margins' : 'text';
  const imageBackgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
  };

  return (
    <section
      id="image-with-text-container"
      className="content-image"
      style={imageBackgroundStyle}
    >
      <div>
        <div className="adjust-margins">
          <p id="image-with-text-title" className="title">
            {mainTitle}
          </p>
          <p id="image-with-text-text" className={textClassNames}>
            {subText}
          </p>
          {/* TODO shouldnt have a link in a button */}
          {buttonText && buttonUrl
          && (
          <a className="button" href={buttonUrl}>
            {buttonText}
          </a>
          )}
        </div>
      </div>
    </section>
  );
};

ImageWithText.propTypes = {
  mainTitle: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  buttonUrl: PropTypes.string,
  backgroundImage: PropTypes.oneOfType(
    [PropTypes.string, PropTypes.arrayOf(PropTypes.string)],
  ),
};

ImageWithText.defaultProps = {
  buttonUrl: '',
  buttonText: '',
  backgroundImage: '',
};

export default ImageWithText;
