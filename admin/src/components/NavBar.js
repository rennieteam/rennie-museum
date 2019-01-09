import React, { Component } from 'react';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  render() {
    return (
      <div className="">
        <a href="/events"> Events </a>
        <a href="/events/new"> New Event </a>
      </div>
    );
  }
}

export default NavBar;
