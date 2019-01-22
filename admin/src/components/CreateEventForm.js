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
        this.props.setMessage('Event Successfully Created');
        this.resetQuery();
      })
      .catch((error) => {

      })
  };

  render() {
    return (
      <div className="create-event-form">
        <h2> Create New Event </h2>
        <label> Select Exhibit </label>
        <DateTimePicker
          onChange={this.setDate}
          value={this.state.date}
        />
        <label> Select Number of Spots </label>
        <input onChange={this.handleChange} name="numberOfAttendees" value={this.state.numberOfAttendees}/>
        <button onClick={this.handleSubmit}> Create Event </button>
        <button onClick={this.resetQuery} > Cancel </button>
      </div>
    );
  }
}

export default CreateEventForm;
