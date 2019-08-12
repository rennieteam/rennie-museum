import React, { Component } from 'react';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: null
    };
  };

  renderItem = (item, fn) => {
    return(
      <div className="form-item" key={item.id}>
        {item.name}
        {
          !item.default ? <i className="delete-item fas fa-times" onClick={() => fn(item)}/> : ''
        }
      </div>
    )
  };

  resetOption = () => {
    this.setState({ option: '' });
  };

  renderOption = () => {
    let option;
    switch(this.state.option){
      case null:
        break;
    };
    return option;
  };

  setOption = (option) => {
    this.setState({ option });
  };

  render() {
    return (
      <div className="settings-container">
        <div className="settings-option"> new designation </div>
        <div className="settings-option"> attendees </div>
        {this.renderOption()}
      </div>
    );
  }
}

export default Settings;
