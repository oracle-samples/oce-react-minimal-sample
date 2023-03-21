/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import * as React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Section from '../components/Section';
import LoadingSpinner from '../components/LoadingSpinner';

/**
* Component for Page.
*/
export default function Page({ fetchInitialData, serverData, title }) {
  const [pageData, setPageData] = React.useState(() => {
    let ret;
    if (process.env.IS_BROWSER && window.INITIAL_DATA.length > 1) {
      ret = window.INITIAL_DATA.pop(); // extract the page data from the array and remove it
    } else if (!process.env.IS_BROWSER) {
      // eslint-disable-next-line prefer-destructuring
      ret = serverData[1];
    }
    return ret;
  });

  const [loading, setLoading] = React.useState(!pageData);

  const fetchNewRepos = React.useRef(!pageData);

  const { slug } = useParams();

  React.useEffect(() => {
    document.title = title;
  }, [title]);

  React.useEffect(() => {
    if (fetchNewRepos.current === true) {
      setLoading(true);

      fetchInitialData(slug)
        .then((page) => {
          setPageData(page);
          setLoading(false);
        });
    } else {
      fetchNewRepos.current = true;
    }
  }, [slug, fetchNewRepos]);

  if (loading) {
    return <LoadingSpinner />;
  }
  const { sections } = pageData.fields;
  return (
    <div key={pageData.id}>
      {sections && (
      <div id="sections">
        {sections.map(
          (section) => (
            <Section section={section} key={section.id} />
          ),
        )}
      </div>
      )}
    </div>
  );
}

Page.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  serverData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  title: PropTypes.string.isRequired,
};
