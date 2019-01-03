import React, {Component} from 'react';
import axios from 'axios';
import config from '../config.js';

class EventSignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      event_id: this.props.event.id,
      guests: [],
      remainingSpots: config.EVENT_MAX - this.props.event.numberOfAttendees
    };
  };

  handleChange = (event) => {
    const newState = Object.assign({}, this.state, {
      [event.target.name]: event.target.value
    });
    this.setState(newState);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`${config.API_URL}/api/attendees`, this.state)
      .then((result) => {
        
      })
  };

  addGuest = (event) => {
    event.preventDefault();
    let guests = this.state.guests;
    guests.push({name: '', email: ''});
    this.setState({guests: guests});
  };

  handleGuestChange = (event, index) => {
    let guests = Object.assign([], this.state.guests);
    guests[index][event.target.name] = event.target.value;
    this.setState({guests: guests});
  };

  guestInput = (guest, index) => {
    return(
      <div key={index}>
        <span> Guest {index + 1} </span>
        <label> Name: </label>
        <input name="name" onChange={(event) => this.handleGuestChange(event, index)} />
        <label> Email: </label>
        <input name="email" onChange={(event) => this.handleGuestChange(event, index)} />
      </div>
    )
  };

  render() {
    return (
      <form className="event-signup-form">
        <h2> Tour: {this.props.event.id} </h2>
        <label> Name: </label>
        <input name="name" value={this.state.name} onChange={this.handleChange} />
        <label> Email: </label>
        <input name="email" value={this.state.email} onChange={this.handleChange} />
        <button onClick={this.addGuest}> Add Guest </button>
        {
          this.state.guests.map((guest, index) => {
            return(
              this.guestInput(guest, index)
            )
          })
        }
        <button onClick={this.handleSubmit}> Submit </button>
        <button onClick={this.props.closeForm}> Cancel </button>
      </form>
    )
  };

};

export default EventSignUpForm ;