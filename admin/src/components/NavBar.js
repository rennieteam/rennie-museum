import React, { Component } from 'react';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };


  render() {
    return (
      <div className="admin-nav">
        <a className="admin-nav-item" href="#index=true"> Events </a>
        <a className="admin-nav-item" href="#newEvent=true"> New Event </a>
      </div>
    );
  }
}

export default NavBar;
