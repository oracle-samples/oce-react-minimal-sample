/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import filterXSS from 'xss';
import { getRenditionURLs } from '../scripts/services';

/**
 * Section component.
 *
 * @param section the section to be displayed
 */
const Section = ({ section }) => {
  const [renditionURLs, setRenditionURLs] = useState(section.renditionURLs);
  const options = {
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
    // to filter out its content
  };

  const { fields } = section;
  const {
    heading,
    type,
    body,
    image,
    actions,
  } = fields;
  const cleantext = filterXSS(body, options);

  // fetch renditionURLs
  useEffect(() => {
    // if no background is set or renditionURLs are already present, return
    // else fetch from the server
    if (!image || section.renditionURLs) return;
    getRenditionURLs(image.id).then((urls) => {
      setRenditionURLs(urls);
    }, console.error);
  }, [section]);

  return (
    <section className={`content ${type}`} key={section.id}>
      <div>
        {renditionURLs && (
          <picture>
            <source type="image/webp" srcSet={renditionURLs.srcset} />
            <source srcSet={renditionURLs.jpgSrcset} />
            <img
              id="header-image"
              src={renditionURLs.large}
              alt="Company Logo"
              width={renditionURLs.width}
              height={renditionURLs.height}
            />
          </picture>
        )}
        <div className="textcontent">
          <h1>{heading}</h1>
          <div className="text">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: cleantext }} />
          </div>
          {actions && (
            <div>
              {actions.map((action) => (
                <a className="button" href={action.link}>
                  {action.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

Section.propTypes = {
  section: PropTypes.shape().isRequired,
};

export default Section;
