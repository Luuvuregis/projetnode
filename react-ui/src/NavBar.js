import React from 'react';

class NavBar extends React.Component {
    render() {
      return (
      <ul class="nav justify-content-center bg-dark">
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#">Home <span className="sr-only">(current)</span></a></li>
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#">About</a></li>
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#" data-toggle="modal" data-target="#registrationFormId">Register</a></li>
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#" data-toggle="modal" data-target="#LoginFormId">Login</a></li>
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#">Logout</a></li>
      </ul>);
    };
  }

  export default NavBar;