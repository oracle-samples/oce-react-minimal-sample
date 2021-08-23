/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import React from 'react';
// When you wrap withRouter around a component it will give
// you read access to your history and location objects within this.props
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
* Header component.
*
* @param headerRenditionURLs rendition urls for the header logo
* @param pages the pages data
* @param location the location object made available via withRouter
*/
class Header extends React.Component {
  constructor(props) {
    super(props);
    // from the location determine which page if any is selected
    this.setSelectedPageIndex();
  }

  /*
   * Show/hide the drop down menu in narrow screens when the
   * button is clicked and update the button styling.
   */
  static onDropDownMenuButtonClicked() {
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
  onMenuItemClicked(index) {
    // set the current nav index
    this.setState({ selectedPageIndex: index });
    // Close the menu and update the button styling
    const dropDownMenu = document.getElementById('nav-menu-items');
    const menuButton = document.getElementById('nav-menu-button');
    dropDownMenu.className = '';
    menuButton.className = '';
  }

  setSelectedPageIndex() {
    const { location, pages } = this.props;
    const { pathname } = location;
    const pageslug = pathname.split('/').pop();
    let selectedPageIndex = 0;
    selectedPageIndex = pages.findIndex((page) => page.slug === pageslug);
    this.state = {
      selectedPageIndex,
    };
  }

  /*
  * Render this component
  */
  render() {
    const { headerRenditionURLs, pages } = this.props;
    const { selectedPageIndex } = this.state;
    const pageItems = pages.map((page, index) => (
      <li key={page.slug}>
        <Link
          id={page.slug}
          className={selectedPageIndex === index ? 'active' : ''}
          onClick={() => this.onMenuItemClicked(index)}
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
            onClick={Header.onDropDownMenuButtonClicked}
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
}

Header.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  headerRenditionURLs: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default withRouter(Header);
