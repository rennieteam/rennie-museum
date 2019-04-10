import React, { Component } from 'react';
import config from './../config';
import axios from 'axios';

let defaultCreateTypeState = {
  name: '',
  message: '',
  remove: {}
};

class CreateEventType extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultCreateTypeState);
  };

  handleChange = (event) => {
    const newState = Object.assign({}, this.state);
    newState[event.target.name] = event.target.value;
    newState.message = '';
    this.setState(newState);
  };

  handleDelete = (item) => {
    // discuss deleting event type with Darrell and Josh
  };

  handleSubmit = () => {
    if(!this.state.name){
      this.setState({ message: 'Please provide a name.' });
    } else {
      let url;
      if(process.env.REACT_APP_ENV){
        url = config[process.env.REACT_APP_ENV];
      } else {
        url = config.development;
      };
      axios.post(`${url}/api/events/new_type`, this.state)
        .then((result) => {
          if(result.data.error){
            this.setState({ message: result.data.error });
          } else {
            this.props.updateEventTypes(result.data.eventTypes);
            this.setState({ message: 'New event type created.', name: '' });
          };
        })
        .catch((error) => {
          console.log(error)
        })
    }
  };

  render() {
    return (
      <div className="create-event-type-form option-form">
        <h1 className="form-header"> Event Types </h1>
        {
          this.props.eventTypes.map((type) => {
            return this.props.renderItem(type, this.handleDelete);
          })
        }
        <div className="form-inputs">
          <input placeholder="Name" className="name-input" name="name" value={this.state.name} onChange={this.handleChange}/>
          <button className="create-button" onClick={this.handleSubmit}> Create New Type </button>
        </div>
        <div className="form-message"> {this.state.message} </div>
        <i className="fas fa-times close" onClick={() => {this.props.resetOption(); this.setState(defaultCreateTypeState)}}/>
      </div>
    );
  }
}

export default CreateEventType;
