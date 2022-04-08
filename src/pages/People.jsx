/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
import React from 'react';
import PropTypes from 'prop-types';

import fetchPeople from '../scripts/services-graphql';
import Section from '../components/Section';
import Person from '../components/Person';
import Error from '../components/Error';

/**
* Component for People.
*/
class People extends React.Component {
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
    if (!data) {
      const { location } = this.props;
      const { pathname } = location;
      const newSlug = pathname.split('/').pop();
      this.state = {
        pageData: null,
        pageSlug: newSlug,
      };
      this.fetchData(newSlug);
    } else {
    // The data will be an array containing one object data obtained from the
    // App component and another object with the data from this component.
      this.state = {
        pageData: data[1],
        pageSlug: data[1].slug,
      };
    }
  }

  // called when any of the component's properties changes
  // if the properties have changed, reload the data
  componentDidUpdate() {
    const { pageSlug } = this.state;
    const { location } = this.props;
    const { pathname } = location;
    const newSlug = pathname.split('/').pop();
    if (pageSlug !== newSlug) {
      this.fetchData(newSlug);
    }
  }

  // Client Side Data Fetching: called from Client when doing client side routing/hydration
  async fetchData(slug) {
    const pageData = await fetchPeople(slug);
    document.title = pageData.name;
    this.setState(() => ({
      pageData,
      pageSlug: slug,
    }));
  }

  render() {
    const { pageData } = this.state;
    if (!pageData) {
      return (<></>);
    }
    if (pageData.hasError) {
      return (
        <Error errorObj={pageData} />
      );
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
}

// Server Side Data Fetching: called from Express server when sending HTML to client
function fetchInitialData(req) {
  const pageslug = req.path.split('/').pop();
  return fetchPeople(pageslug);
}

/*
* Export an object with name value pairs of fetchInitialData function and component.
*/
export default {
  fetchInitialData,
  component: People,
};

People.propTypes = {
  staticContext: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
  }),
  location: PropTypes.shape().isRequired,
};

People.defaultProps = {
  staticContext: {},
};
