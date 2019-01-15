import React, { Component } from 'react';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  setEventIndexView = () => {
    this.props.history.push({
      search: "?index=true"
    })
  }

  setNewEventView = () => {
    this.props.history.push({
      search: '?newEvent=true'
    });
  }

  render() {
    return (
      <div className="">
        <span onClick={this.setEventIndexView}> Events </span>
        <span onClick={this.setNewEventView}> New Event </span>
      </div>
    );
  }
}

export default NavBar;
