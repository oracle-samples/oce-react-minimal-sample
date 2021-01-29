/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';

/**
 * Connect With Us component.
 */
const ConnectWithUs = () => (
  <section className="content connect-with-us">

    <h1>Connect with us:</h1>

    <div className="text">
      <p>
        You can post your questions to our&nbsp;
        <a
          className="connect-with-us-link"
          href="https://cloudcustomerconnect.oracle.com/resources/f987e90cba/summary"
        >
          <strong>Oracle Cloud Connect forum</strong>
        </a>
      </p>
      <p>
        Check out all our samples&nbsp;
        <a
          className="connect-with-us-link"
          href="https://www.oracle.com/middleware/technologies/content-experience-downloads.html"
        >
          <strong>here</strong>
        </a>
      </p>
    </div>

  </section>
);

export default ConnectWithUs;
