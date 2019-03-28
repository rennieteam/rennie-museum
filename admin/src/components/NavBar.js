import React, { Component } from 'react';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };


  render() {
    return (
      <div className="admin-nav" id="admin-nav">
        <a className="admin-nav-item" href="#index"> Events </a>
        <a className="admin-nav-item" href="#newEvent"> New Event </a>
      </div>
    );
  }
}

export default NavBar;
