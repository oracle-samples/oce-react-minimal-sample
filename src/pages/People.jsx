/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Section from '../components/Section';
import Person from '../components/Person';
import LoadingSpinner from '../components/LoadingSpinner';

/**
* Component for People.
*/
export default function People({ fetchInitialData, serverData, title }) {
  const [pageData, setPageData] = React.useState(() => {
    let ret;
    if (process.env.IS_BROWSER && window.INITIAL_DATA.length > 1) {
      ret = window.INITIAL_DATA.pop(); // extract the people data from the array and remove it
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

  const { people, announcement } = pageData.fields;

  return (
    <>
      <Section section={announcement} key={announcement.id} />
      {people && (
      <div className="all_people">
          {people.map(
            (person) => (
              <Person
                renditionURLs={person.renditionURLs}
                name={person.fields.fullname}
                position={person.fields.title}
                description={person.fields.biodata}
                key={person.id}
              />
            ),
          )}
      </div>
      )}
    </>
  );
}

People.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  serverData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  title: PropTypes.string.isRequired,
};
