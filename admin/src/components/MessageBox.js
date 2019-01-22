import React, { Component } from 'react';

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  render() {
    return this.props.message ? (
      <div className="">
        <h2> {this.props.message} </h2>
        <p onClick={() => this.props.setMessage(null)} > Close </p>
      </div>
    ) : ''
  };
}

export default MessageBox;
