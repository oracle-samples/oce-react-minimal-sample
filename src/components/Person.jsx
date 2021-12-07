/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
import PropTypes from 'prop-types';

/* Props should have name, position, description, renditionURLs */
const Person = ({
  name, position, description, renditionURLs,
}) => (
  <section className="person">
    {renditionURLs && (
      <picture>
        <source type="image/webp" srcSet={renditionURLs.srcset} sizes="300px" />
        <source srcSet={renditionURLs.jpgSrcset} sizes="300px" />
        <img className="profile_picture" src={renditionURLs.thumbnail} alt={name} />
      </picture>
    )}
    <div className="profile">
      <div className="profile_name">{name}</div>
      <div className="profile_position">{position}</div>
      <div className="profile_description">{description}</div>
    </div>
  </section>
);
Person.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  renditionURLs: PropTypes.shape().isRequired,
};

export default Person;
