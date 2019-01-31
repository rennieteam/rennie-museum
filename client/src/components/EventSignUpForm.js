import React, {Component} from 'react';
import axios from 'axios';
import config from '../config.js';
import validator from 'email-validator';

class EventSignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      EventId: this.props.event.id,
      guests: [],
      remainingSpots: config.EVENT_MAX - this.props.event.numberOfAttendees,
      error: false,
      subscribe: false
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
    if (this.state.name && validator.validate(this.state.email) && this.state.guests.every(this.checkEmptyGuest)) {
      let url;
      if(process.env.NODE_ENV === 'development'){
        url = config.developmentUrl;
      } else {
        url = config.productionUrl;
      };
      axios.post(`${url}/api/attendees`, this.state)
        .then((result) => {
          this.props.submitMessageToggle(true);
          this.props.closeForm();
        })
        .catch((error) => {
          this.setState({error: true});
        })
    } else {
      this.setState({error: true});
    };
  };

  checkEmptyGuest = (guest) => {
    return guest.name;
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

  mailSubscribe = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({subscribe: value})
  };

  signUpForm = () => {
    return(
      <form className="event-signup-form">
        <h2> Tour: {this.props.event.id} </h2>
        <label> Name: </label>
        <input name="name" value={this.state.name} onChange={this.handleChange} />
        <label> Email: </label>
        <input name="email" value={this.state.email} onChange={this.handleChange} />
        <button onClick={this.addGuest} disabled={this.state.guests.length >= this.state.remainingSpots - 1}> Add Guest </button>
        {
          this.state.guests.map((guest, index) => {
            return(
              this.guestInput(guest, index)
            )
          })
        }
        <label> Subscribe </label>
        <input type="checkbox" value={this.state.subscribe} onChange={this.mailSubscribe}/>
        <button onClick={this.handleSubmit}> Submit </button>
        <button onClick={this.props.closeForm}> Cancel </button>
        {
          this.state.error ? <p> ERROR </p> : ''
        }
      </form>
    )
  }

  render() {
    return (
      this.signUpForm()
    )
  };

};

export default EventSignUpForm ;