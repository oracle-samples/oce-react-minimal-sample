/**
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React, { useEffect, useState } from 'react';
// When you wrap withRouter around a component it will give
// you read access to your history and location objects within this.props
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
* Header component.
*
* @param headerRenditionURLs rendition urls for the header logo
* @param pages the pages data
* @param location the location object made available via withRouter
*/
export default function Header({ headerRenditionURLs, pages }) {
  const location = useLocation();
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  // function to get query params using URLSearchParams
  useEffect(() => {
    const { pathname } = location;
    const pageslug = pathname.split('/').pop();
    const index = pages.findIndex((page) => page.slug === pageslug);
    setSelectedPageIndex(index > -1 ? index : 0);
  }, [location]);

  /*
   * Show/hide the drop down menu in narrow screens when the
   * button is clicked and update the button styling.
   */
  function onDropDownMenuButtonClicked() {
    const dropDownMenu = document.getElementById('nav-menu-items');
    const menuButton = document.getElementById('nav-menu-button');

    if (dropDownMenu.className === '') {
      dropDownMenu.className = 'displayed';
      menuButton.className = 'active';
    } else {
      dropDownMenu.className = '';
      menuButton.className = '';
    }
  }

  /*
  * Handle an item being clicked on from the menu
  */
  function onMenuItemClicked(index) {
    // set the current nav index
    setSelectedPageIndex(index);
    // Close the menu and update the button styling
    const dropDownMenu = document.getElementById('nav-menu-items');
    const menuButton = document.getElementById('nav-menu-button');
    dropDownMenu.className = '';
    menuButton.className = '';
  }

  const pageItems = pages.map((page, index) => (
    <li key={page.slug}>
      <Link
        id={page.slug}
        className={selectedPageIndex === index ? 'active' : ''}
        onClick={() => onMenuItemClicked(index)}
        to={{ pathname: `/page/${page.slug}` }}
        style={{ textDecoration: 'none' }}
      >
        {page.name}
      </Link>
    </li>
  ));

  return (
    <header id="header">
      {/* Header Logo */}
      {headerRenditionURLs
        && (
          <picture>
            <source type="image/webp" srcSet={headerRenditionURLs.srcset} />
            <img
              id="header-image"
              src={headerRenditionURLs.native}
              alt="Company Logo"
              width={headerRenditionURLs.width}
              height={headerRenditionURLs.height}
            />
          </picture>
        )}
      {/* Collapsed menu */}
      <nav>
        <button
          id="nav-menu-button"
          onClick={onDropDownMenuButtonClicked}
          type="button"
        >
          ☰
        </button>

        <ul id="nav-menu-items">
          {pageItems}
        </ul>
      </nav>

    </header>
  );
}

Header.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  headerRenditionURLs: PropTypes.shape().isRequired,
};
