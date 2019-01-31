import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import config from './../config';
import qs from 'query-string';

class CreateEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      numberOfAttendees: 0,
      externalId: 1,
      externalSlug: 'to-replace-later'
    };
  };

  handleChange = (event) => {
    const newState = Object.assign({}, this.state, {
      [event.target.name]: event.target.value
    });
    this.setState(newState);
  };

  setDate = (date) => {
    this.setState({date: date});
  };

  resetQuery = () => {
    this.props.history.push({
      search: ""
    });
  };

  handleSubmit = () => {
    axios.post(`${config[process.env.NODE_ENV]}/api/events`, this.state)
      .then((result) => {
        this.props.updateEvents(result.data);
        this.props.setMessage('Event Successfully Created');
        // this.resetQuery();
      })
      .catch((error) => {
        console.log(error);
      })
  };

  render() {
    return (
      <div className="create-event-form">
        <h2 className="create-header"> Create New Event </h2>
        <DateTimePicker
          onChange={this.setDate}
          value={this.state.date}
        />
        <div className="spots-container">
          <label> Number of Spots </label>
          <input onChange={this.handleChange} name="numberOfAttendees" value={this.state.numberOfAttendees}/>
        </div>
        <button className="create-button" onClick={this.handleSubmit}> Create Event </button>
        <button className="cancel-button" onClick={this.resetQuery} > Cancel </button>
      </div>
    );
  }
}

export default CreateEventForm;
