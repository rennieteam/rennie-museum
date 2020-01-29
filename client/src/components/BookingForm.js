import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import validator from 'email-validator';
import config from '../config.js';
import moment from 'moment-timezone';
import ToursClosedNotice from './ToursClosedNotice';
import FormHeader from './FormHeader';

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
      fullyBooked: false,
      designation: null,
      designationOptions: [],
      termsRead: false,
      termsChecked: false
    };
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      this.setState({ events: this.props.events })
    };
    if(this.props.dateOptions !== prevProps.dateOptions){
      this.setState({ dateOptions: this.props.dateOptions });
    };
    if(this.props.designationOptions !== prevProps.designationOptions){
      this.setState({ designationOptions: this.props.designationOptions});
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


  selectDesignation = (designation) => {
    this.setState({ designation });
  };

  showForm = (e) => {
    let form = document.getElementsByClassName('booking-form-container')[0];
    const backdrop = document.querySelector('.backdrop');
    const backDropClassList = backdrop.classList;
    let classList = form.classList;
    if(classList.contains('hidden')){
      classList.remove('hidden');
      backDropClassList.toggle('hidden');
    } else {
      classList.add('hidden');
      backDropClassList.toggle('hidden');
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

  checkTerms = (event) => {
    const target = event.target;
    const termsChecked = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ termsChecked });
  };

  promptRead = () => {
    this.setMessage('Please read the terms and conditions.');
  };

  readConditions = () => {
    this.clearMessage();
    this.setState({ termsRead: true });
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

  clearMessage = () => {
    this.setMessage('');
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
    if(!this.state.termsChecked){
      this.setMessage('Please confirm you have read the terms and conditions.');
    } else if(!this.state.EventId) {
      this.setMessage('Please select a date and time.');
    } else if(!this.state.name) {
      this.setMessage('Name is required.');
    } else if(!validEmail){
      let message = this.state.email.length ? 'Invalid email.' : 'Email is required.';
      this.setMessage(message)
    } else if(!guests.every(checkGuests)) {
      this.setMessage('Guest names are required.')
    } else if(!this.state.designation) {
      this.setMessage('Please select a designation.')
    } else {
      bodyParams.forEach((param) => {
        body[param] = this.state[param];
      });
      let url;
      if(process.env.REACT_APP_ENV){
        url = config[process.env.REACT_APP_ENV];
      } else {
        url = config.development;
      };
      let d = moment(this.state.selectedEvent.date).tz('America/Los_Angeles').format('MMMM Do, YYYY - h:mm a')
      body.eventDate = d;
      body.designation = this.state.designation;
      axios.post(`${url}/api/attendees`, body)
        .then((result) => {
          if(result.data.success){
            this.props.initializeData(result.data.events);
            this.setState({ name: '', email: '', selectedDate: null, guests: [{name: '', email: ''}], subscribe: false, selectedTime: null, selectedEvent: {}, designation: null })
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

  renderBookingModule = () => {
    let singleCount = this.state.name || this.state.email ? 1 : 0;
    return (
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
            placeholder={this.state.fullyBooked ? "Fully Booked" : "Time"}
            value={this.state.selectedTime}
            onChange={this.selectTime}
            options={this.state.timeOptions}
            isDisabled={!this.state.selectedDate || this.state.fullyBooked}
            noResultsText={'Fully Booked'}
          />
          {
            this.state.selectedEvent.id && !this.state.fullyBooked ? <div className="availability"> {this.state.selectedEvent.numberOfAttendees - this.state.eventCount - singleCount - this.guestCount()}/{this.state.selectedEvent.numberOfAttendees} Available </div> : <div className="availability-holder"></div>
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
        <div className="designation-container">
          <Select
            placeholder="Please select a designation:"
            className="designation-select"
            options={this.state.designationOptions}
            value={this.state.designation}
            onChange={this.selectDesignation}
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
        <div className="terms-container">
          {
            !this.state.termsRead ? <div className="terms-click-layer" onClick={this.promptRead}></div> : ''
          }
          <input
            name="terms"
            type="checkbox"
            value={this.state.termsChecked}
            onChange={this.checkTerms}
            disabled={!this.state.termsRead}
          />
          <label className="terms-label" htmlFor="terms"> I have read the {<a onClick={this.readConditions} target='blank'href='https://rennie-museum.s3.ca-central-1.amazonaws.com/public/Waiver+of+Claims+and+Release+of+Liability.pdf'>terms and conditions</a>}. </label>
        </div>
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
    )
  };

  renderForm = () => {
    return(
      <div>
        <div className="booking-form-cta">
          <div className="book-form-header">
            <button onClick={this.showForm} className="cta-button">
              <span className="cta-button-text">tours</span>
            </button>
          </div>
          <div className="booking-form-container hidden">
            <div className="booking-form">
              <FormHeader stopProp={this.stopProp} line1='' line2='' />
              {
                this.props.toursOpen && this.props.toursOpen.value ? this.renderBookingModule() : <ToursClosedNotice toursClosedMessage={this.props.toursClosedMessage} />
              }
            </div>
          </div>
        </div>
        <div className="backdrop hidden" onClick={this.showForm} />
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




