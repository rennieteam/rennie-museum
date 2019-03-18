import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import hdate from 'human-date';
import validator from 'email-validator';
import config from '../config.js';
import moment from 'moment-timezone';

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
      disableAddMoreGuests: false,
      fullyBooked: false
    };
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      this.setState({ events: this.props.events })
    };
    if(this.props.dateOptions !== prevProps.dateOptions){
      this.setState({ dateOptions: this.props.dateOptions });
    };
  };

  setTimeOptions = (events, selectedDate) => {
    let filteredEvents = events.filter((event) => {
      let d = moment(event.date).tz('America/Los_Angeles').startOf('day').format();
      return d === selectedDate.value && this.props.calculateCount(event) < event.numberOfAttendees;
    });
    let timeOptions = [];
    filteredEvents.forEach((event) => {
      let formattedTime = moment(event.date).tz('America/Los_Angeles').format('h:mm a');
      let remainingSpots = `${event.numberOfAttendees - this.props.calculateCount(event)} spots remaining`;
      timeOptions.push({ value: event, label: formattedTime + ` - ${remainingSpots}` });
    });
    this.setState({ timeOptions, message: '', fullyBooked: !timeOptions.length });
  };

  selectDate = (selectedDate) => {
    this.setState({ selectedDate, selectedTime: null, EventId: null, disableAddGuest: false, message: '' });
    this.setTimeOptions(this.state.events, selectedDate);
  };

  selectTime = (selectedTime) => {
    let selectedEvent = selectedTime.value;
    let eventCount = this.props.calculateCount(selectedEvent);
    let disableAddGuest = selectedEvent.numberOfAttendees - eventCount - 1 === 0;
    this.setState({
      selectedTime,
      selectedEvent: selectedEvent,
      eventCount,
      EventId: selectedTime.value.id,
      message: ''
    });
    if(disableAddGuest){
      this.setState({
        disableAddGuest,
        guests: []
      });
    };
  };

  showForm = (e) => {
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
        <i className="fas fa-times remove-guest" onClick={() => this.removeGuest(index)} />
      </div>
    )
  };

  addGuest = () => {
    if(this.state.EventId){
      if(this.state.selectedEvent.numberOfAttendees - this.state.eventCount - this.state.guests.length - 1 > 0){
        let guests = Object.assign([], this.state.guests);
        guests.push({name: '', email: ''});
        this.setState({ guests });
      } else {
        this.setMessage('Not enough spots.');
      };
    } else {
      this.setMessage('Please select a tour first.');
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
      this.setMessage('Please select a date and time.');
    } else if(!this.state.name) {
      this.setMessage('Name is required.');
    } else if(!validEmail){
      let message = this.state.email.length ? 'Invalid email.' : 'Email is required.';
      this.setMessage(message)
    } else if(!guests.every(checkGuests)) {
      this.setMessage('Guest names are required.')
    } else {
      bodyParams.forEach((param) => {
        body[param] = this.state[param];
      });
      let url;
      if(process.env.NODE_ENV === 'development'){
        url = config.developmentUrl;
      } else {
        url = config.productionUrl;
      };
      let d = hdate.prettyPrint(new Date(Date.parse(this.state.selectedEvent.date)), {showTime: true});
      body.eventDate = d;
      axios.post(`${url}/api/attendees`, body)
        .then((result) => {
          if(result.data.success){
            this.props.initializeData(result.data.events);
            this.setState({ name: '', email: '', selectedDate: null, guests: [{name: '', email: ''}], subscribe: false, selectedTime: null, selectedEvent: {} })
            this.setMessage('Thank you for booking.');
          } else if(result.data.full){
            this.setState({ selectedTime: null, selectedEvent: {} });
            this.setTimeOptions(result.data.events, this.state.selectedDate);
            this.setMessage(`We're sorry, this time slot is now fully booked, Please make another selection above.`);
          } else if(result.data.tooMany){
            this.setState({ selectedTime: null, selectedEvent: {} });
            this.props.initializeData(result.data.events);
            this.setTimeOptions(result.data.events, this.state.selectedDate);
            this.setMessage(`We're sorry, this time slot no longer has enough spots for your number of visitors.`);
          } else if(result.data.emailUsed){
            this.setMessage('This email has already been registered with this tour.');
          } else if(result.data.publishError){
            this.setMessage('An error has occurred, please refresh and try again.');
          };
        })
        .catch((error) => {
          this.setMessage('Sorry, could not book at this moment.');
        });
    };
  };

  renderForm = () => {
    let singleCount = this.state.name || this.state.email ? 1 : 0;
    return(
      <div className="booking-form-cta" >
        <div className="book-form-header">
          <button onClick={this.showForm} className="cta-button">
            <span className="cta-button-text">tours</span>
          </button>
        </div>
        <div className="booking-form-container hidden" >
          <div className="booking-form">
            <div className="cta-header" onClick={this.stopProp}>
              <p className="header-title"> Spring 2019: <br /> Collected Works </p>
              <p className="sub-header"> Through June 15, 2019 </p>
            </div>
            <div className="form-body" onClick={this.stopProp}>
              <h2 className="form-header"> Your booking details </h2>
              <div className="date-time-select">
                <Select
                  className="date-select"
                  placeholder="Date"
                  value={this.state.selectedDate}
                  onChange={this.selectDate}
                  options={this.state.dateOptions}
                />
                <Select
                  className="time-select"
                  // placeholder="Time"
                  placeholder={this.state.fullyBooked ? "Fully Booked" : "Time"}
                  value={this.state.selectedTime}
                  onChange={this.selectTime}
                  options={this.state.timeOptions}
                  isDisabled={!this.state.selectedDate || this.state.fullyBooked}
                  noResultsText={'Fully Booked'}
                />
                {
                  this.state.selectedEvent.id ? <div className="availability"> {this.state.selectedEvent.numberOfAttendees - this.state.eventCount - singleCount - this.guestCount()}/{this.state.selectedEvent.numberOfAttendees} Available </div> : <div className="availability-holder"></div>
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
                <label className="subscribe-label" htmlFor="subscribe"> I want to receive the rennie museum newsletter </label>
              </div>
              {
                !this.state.disableAddGuest ?
                  <div className="guests-container">
                    {
                      this.state.guests.map( (guest,index) => this.guestInput(guest,index) )
                    }
                    <div className="add-guest" onClick={this.addGuest}>
                      <i
                        className="fas fa-plus"
                      />
                      <span> Add Guest </span>
                    </div>
                  </div>
                  :
                  ''
              }
              {
                this.state.message ? <div className="message-container"> {this.state.message} </div> : ''
              }
              <div className="submit-prompt-container">
                {
                  this.guestCount() + singleCount ? <span className="guest-message"> You are booking {this.guestCount() + singleCount} visitors to the museum. </span> : ''
                }
                <button className="submit-button" onClick={this.handleSubmit}> Book now </button>
              </div>
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
