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
 * @param logoUrl the URL for the image to be displayed in the header
 * @param location the URL which the user should be navigated to when
 *                 they click on the header image
 */
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentNavIndex: 0,
    };
  }

  /**
   * Determine which Menu Item should be highlighted.
   * This is only called on the CLIENT
   */
  componentDidMount() {
    const { location } = this.props;
    const index = (location.pathname === '/contact') ? 1 : 0;
    this.setState({ currentNavIndex: index });
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
    this.setState({ currentNavIndex: index });

    // Close the menu and update the button styling
    const dropDownMenu = document.getElementById('nav-menu-items');
    const menuButton = document.getElementById('nav-menu-button');
    dropDownMenu.className = '';
    menuButton.className = '';
  }

  /*
   * Render this component
   */
  render() {
    const { logoUrl } = this.props;
    const { currentNavIndex } = this.state;

    return (
      <header id="header">
        {/* Header Logo */}
        <Link to={{ pathname: '/' }} style={{ textDecoration: 'none' }}>
          <img id="header-image" src={logoUrl} alt="Company Logo" />
        </Link>

        {/* Menu : Home | Contact Us */}
        <nav>
          <button
            id="nav-menu-button"
            onClick={Header.onDropDownMenuButtonClicked}
            type="button"
          >
            ☰
          </button>

          <ul id="nav-menu-items">
            <li>
              <Link
                id="header-link-home"
                className={currentNavIndex === 0 ? 'active' : ''}
                onClick={() => this.onMenuItemClicked(0)}
                to={{ pathname: '/' }}
                style={{ textDecoration: 'none' }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                id="header-link-contactus"
                className={currentNavIndex === 1 ? 'active' : ''}
                onClick={() => this.onMenuItemClicked(1)}
                to={{ pathname: '/contact' }}
                style={{ textDecoration: 'none' }}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

      </header>
    );
  }
}

Header.propTypes = {
  logoUrl: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default withRouter(Header);
