import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import config from './../config';
import { Cat } from 'react-kawaii';

class CreateEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      numberOfAttendees: 15,
      externalId: 1,
      externalSlug: 'to-replace-later',
      events: [],
      error: false,
      success: false,
      message: '',
      published: false
    };
  };

  componentDidMount = () => {
    this.setState({ events: this.props.events });
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      this.setState({ events: this.props.events });
    };
  };

  handleChange = (event) => {
    const newState = Object.assign({}, this.state, {
      [event.target.name]: event.target.value
    });
    newState.message = '';
    newState.success = false;
    newState.error = false;
    this.setState(newState);
  };

  setDate = (date) => {
    this.setState({date: date, message: '', error: false, success: false});
  };

  handleSubmit = () => {
    let e = this.state.events.find((event) => {
      return `${new Date(event.date)}` === `${new Date(this.state.date)}`;
    });
    if(e){
      this.setState({ message: 'Date and time already exists.', error: true });
    } else if(!this.state.date){
      this.setState({ message: `Please select a date.`, error: true });
    } else if(!parseInt(this.state.numberOfAttendees)) {
      this.setState({ message: `Number of spots can't be zero or blank.`, error: true });
    } else {
      let url;
      if(process.env.REACT_APP_ENV){
        url = config[process.env.REACT_APP_ENV];
      } else {
        url = config.development;
      };
      axios.post(`${url}/api/events`, this.state)
        .then((result) => {
          this.props.updateEvents(result.data);
          this.props.setMessage('Event Successfully Created');
          this.setState({ message: 'Event successfully created!', success: true, date: null, numberOfAttendees: 15, published: false });
        })
        .catch((error) => {
          this.setState({ message: 'Sorry, please try again.', error: true });
        })
    }
  };

  togglePublish = (event) => {
    this.setState({ published: event.target.checked });
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
        <div className="publish-checkbox-container">
          <label> Published </label>
          <input
            name="published" 
            type="checkbox"
            checked={this.state.published} 
            onChange={this.togglePublish}
          />
        </div>
        {
          this.state.error ? <Cat size={200} mood="sad" color="#596881"/> : this.state.success ? <Cat size={200} mood="blissful" color="#596881" /> : ''
        }
        {
          this.state.message ? <p className='create-form-message'> {this.state.message} </p> : ''
        }
        <button className="create-button" onClick={this.handleSubmit}> Create Event </button>
      </div>
    );
  }
}

export default CreateEventForm;
