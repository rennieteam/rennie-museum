import React, { Component } from 'react';
import CreateEventType from './CreateEventType';

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
      case 'event type':
        option = <CreateEventType 
                    eventTypes={this.props.eventTypes} 
                    renderItem={this.renderItem} 
                    updateEventTypes={this.props.updateEventTypes}
                    resetOption={this.resetOption}
                  />;
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
        <div className="settings-option" onClick={() => this.setOption('event type')}> new event type </div>
        <div className="settings-option"> new designation </div>
        <div className="settings-option"> attendees </div>
        {this.renderOption()}
      </div>
    );
  }
}

export default Settings;
