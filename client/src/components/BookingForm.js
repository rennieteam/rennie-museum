import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
// import Moment from 'react-moment';
import hdate from 'human-date';
import validator from 'email-validator';
import config from '../config.js';

class BookingForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      openForm: true,
      selectedDate: null,
      selectedTime: null,
      selectedEvent: {},
      dateOptions: [],
      timeOptions: [],
      eventCount: null,
      events: [],
      name: '',
      email: '',
      EventId: null,
      guests: [{name: '', email: ''}],
      message: '',
      subscribe: false,
      disableAddGuest: false,
      disableAddMoreGuests: false
    };
  };

  componentDidMount = () => {
    axios.get(`${config.API_URL}/api/events`)
      .then((results) => {
        this.setState({ events: results.data });
        let dupCheck = [];
        let dateOptions = [];
        results.data.forEach((result) => {
          let dateWithTime = new Date(result.date);
          let dateWithZeroedTime = dateWithTime.setHours(0,0,0,0);
          if(!dupCheck.includes(dateWithZeroedTime)){
            dateOptions.push({ value: dateWithZeroedTime, label: hdate.prettyPrint(new Date(Date.parse(result.date))) })
            dupCheck.push(dateWithZeroedTime);
          };
        });
        this.setState({ dateOptions });
      })
  };

  calculateCount = (event = {}) => {
    let eventCount = event.attendees.length;
    if(eventCount >= event.numberOfAttendees){
      return eventCount;
    } else {
      event.attendees.forEach((attendee) => {
        eventCount += attendee.guests.length;
      });
    };
    return eventCount;
  };

  selectDate = (selectedDate) => {
    this.setState({ selectedDate });
    let filteredEvents = this.state.events.filter((event) => {
      let d = new Date(event.date)
      return d.setHours(0,0,0,0) === selectedDate.value && this.calculateCount(event) < event.numberOfAttendees;
    });
    let timeOptions = [];
    filteredEvents.forEach((event) => {
      let d = hdate.prettyPrint(new Date(Date.parse(event.date)), {showTime: true});
      let splitDate = d.split(' ');
      let index = splitDate.indexOf('at') + 1;
      let remainingSpots = `${event.numberOfAttendees - this.calculateCount(event)} spots remaining`;
      timeOptions.push({ value: event, label: splitDate.splice(index).join(' ') + ` - ${remainingSpots}` });
    });
    this.setState({ timeOptions })
  };

  selectTime = (selectedTime) => {
    let selectedEvent = selectedTime.value;
    let eventCount = this.calculateCount(selectedEvent);
    let disableAddGuest = selectedEvent.numberOfAttendees - eventCount - 1 === 0;
    this.setState({ 
      selectedTime, 
      selectedEvent: selectedEvent,
      eventCount,
      EventId: selectedTime.value.id
    });
    if(disableAddGuest){
      this.setState({
        disableAddGuest,
        guests: []
      });
    };
  };

  showForm = () => {
    let form = document.getElementsByClassName('booking-form-container')[0];
    let classList = form.classList;
    if(classList.contains('hidden')){
      classList.remove('hidden');
    } else {
      classList.add('hidden');
    };
  };

  stopProp = (e) => {
    e.stopPropagation();
  };

  showState = () => {
    console.log(this.state);
  };

  handleAttendeeInfo = (event) => {
    const newState = Object.assign({}, this.state, {
      [event.target.name]: event.target.value
    });
    this.setState(newState);
  };

  handleGuestChange = (event, index) => {
    let guests = Object.assign([], this.state.guests);
    guests[index][event.target.name] = event.target.value;
    this.setState({ guests });
  };

  mailSubscribe = (event) => {
    const target = event.target;
    const subscribe = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ subscribe });
  };

  guestInput = (guest, index) => {
    const params = [{value: 'name', req: true}, {value: 'email', req: false}];
    return(
      <div className="guest-inputs" key={index}>
        {
          params.map((param) => {
            let req = param.req ? '*' : '';
            return(
              <input 
                key={param.value} 
                name={param.value}
                placeholder={`Guest ${param.value}${req}`} 
                onChange={(event) => this.handleGuestChange(event, index)}
                value={this.state.guests[index][param.value]}
              />
            )
          })
        }
        <div onClick={() => this.removeGuest(index)}> X </div>
      </div>
    )
  };

  addGuest = () => {
    if(this.state.EventId){
      let guests = Object.assign([], this.state.guests);
      guests.push({name: '', email: ''});
      this.setState({ guests });
    } else {
      this.setMessage('Please select a tour first');
    };
  };

  removeGuest = (index) => {
    if(this.state.guests.length === 1){
      this.setState({ guests: [] });
    } else {
      let guests = Object.assign([], this.state.guests);
      guests.splice(index, 1);
      this.setState({ guests });
    };
  };

  guestCount = () => {
    let checkedGuests = this.state.guests.filter((guest) => {
      return guest.name || guest.email;
    });
    return checkedGuests.length;
  };

  setMessage = (message) => {
    this.setState({ message });
  };

  handleSubmit = () => {
    let body = {};
    let bodyParams = ['name', 'email', 'subscribe', 'EventId'];
    let validEmail = validator.validate(this.state.email);
    let guests = this.state.guests.filter((guest) => {
      return guest.name || guest.email;
    });
    const checkGuests = guest => guest.name;
    body.guests = guests;
    if(!this.state.EventId) {
      this.setMessage('Please select a date and time');
    } else if(!this.state.name) {
      this.setMessage('Name is required');
    } else if(!validEmail){
      let message = this.state.email.length ? 'Invalid email' : 'Email is required';
      this.setMessage(message)
    } else if(!guests.every(checkGuests)) {
      this.setMessage('Guest names are required')
    } else {
      bodyParams.forEach((param) => {
        body[param] = this.state[param];
      });
      axios.post(`${config.API_URL}/api/attendees`, body)
        .then((result) => {
          this.setMessage('Thank you for booking');
        })
        .catch((error) => {
          this.setMessage('Sorry, could not book at this moment');
        })
    }
  };

  renderForm = () => {
    return(
      <div className="booking-form-cta" onClick={this.showForm}>
        book a tour
        <div className="booking-form-container">
          <div className="booking-form">
            <div className="header"> Spring 2019 </div>
            <div className="form-body" onClick={this.stopProp}>
              <div className="date-time-select">
                <Select
                  className="date-select"
                  placeholder="Select a date"
                  value={this.state.selectedDate}
                  onChange={this.selectDate}
                  options={this.state.dateOptions}
                />
                <Select 
                  className="time-select"
                  placeholder="Select a time"
                  value={this.state.selectedTime}
                  onChange={this.selectTime}
                  options={this.state.timeOptions}
                  isDisabled={!this.state.selectedDate}
                />
                {
                  this.state.selectedEvent.id ? <div className="availability"> {this.state.selectedEvent.numberOfAttendees - this.state.eventCount}/{this.state.selectedEvent.numberOfAttendees} Available </div> : ''
                }
              </div>
              <div className="attendee-info">
                <input 
                  className="attendee-name-input"
                  placeholder="Your Name*"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleAttendeeInfo}
                />
                <input 
                  className="attendee-email-input"
                  placeholder="Your Email*"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleAttendeeInfo}
                />
              </div>
              <div className="subscribe-container">
                <input
                  name="subscribe"
                  type="checkbox"
                  value={this.state.subscribe}
                  onChange={this.mailSubscribe}
                />
                <label className="subscribe-label" htmlFor="subscribe"> I want to receive to the rennie museum newsletter </label>
              </div>
              {
                !this.state.disableAddGuest ? 
                  <div className="guests-container">
                    {
                      this.state.guests.map( (guest,index) => this.guestInput(guest,index) )
                    }
                    <button 
                      onClick={this.addGuest}
                      disabled={this.state.selectedEvent.numberOfAttendees - this.state.eventCount - this.state.guests.length - 1 <= 0}
                    > Add Guest 
                    </button>
                  </div>
                  :
                  ''
              }
              {
                this.state.message ? <div className="message-container"> {this.state.message} </div> : ''
              }
              <div className="submit-prompt-container">
                {
                  this.guestCount() ? <span> You are booking {this.guestCount()} visitors to the museum. </span> : ''
                }
                <button onClick={this.handleSubmit}> Submit </button>
              </div>

              <button onClick={this.showState}> State </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render = () => {
    return(
      this.renderForm()
    )
  };

};

export default BookingForm;