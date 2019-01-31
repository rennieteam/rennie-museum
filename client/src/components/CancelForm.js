import React, { Component } from 'react';
import axios from 'axios';
import qs from 'query-string';
import Select from 'react-select';
import hdate from 'human-date';


import config from '../config.js';

class CancelForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      attendee: {},
      cancelSuccess: false,
      updateSuccess: false,
      guests: [],
      events: [],
      dateOptions: [],
      event: {},
      selectedDate: null,
      selectedTime: null,
      selectedEvent: {},
      message: '',
      timeOptions: [],
      EventId: null,
      eventCount: null,
      isLoading: true,
      initialLoad: true
    };
  };

  componentDidMount = () => {
    let q = qs.parse(this.props.location.hash);
    let url;
    if(process.env.NODE_ENV === 'development'){
      url = config.developmentUrl;
    } else {
      url = config.productionUrl;
    };
    axios.get(`${url}/api/attendee/${q.cancel}`)
      .then((result) => {
        this.setState({attendee: result.data, guests: result.data.guests, selectedEvent: result.data.Event, isLoading: false});
      })
      .catch((error) => {
        this.setState({ isLoading: false });
      })
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      this.setState({ events: this.props.events });
    };
    if(this.props.dateOptions !== prevProps.dateOptions){
      if(this.state.attendee.id){
        let event = this.props.events.find((event) => {
          return event.id === this.state.attendee.Event.id;
        });
        let eventCount = this.props.calculateCount(event);
        let date = hdate.prettyPrint(new Date(Date.parse(this.state.attendee.Event.date)));
        let dateIndex = this.props.dateOptions.findIndex((el) => {return el.label === date});
        this.setState({ dateOptions: this.props.dateOptions, eventCount});
        this.selectDate(this.props.dateOptions[dateIndex]);
      };
    };
  };

  setMessage = (message) => {
    this.setState({message});
  };

  selectTime = (selectedTime) => {
    this.setState({ message: '' });
    let selectedEvent = selectedTime.value;
    let eventCount = this.props.calculateCount(selectedEvent);
    let insufficientSpots;
    if(selectedEvent.id === this.state.attendee.EventId){
      insufficientSpots = selectedEvent.numberOfAttendees - eventCount < this.state.guests.length - this.state.attendee.guests.length;
    } else {
      insufficientSpots = selectedEvent.numberOfAttendees - eventCount < this.state.guests.length + 1;
    };
    this.setState({
      selectedTime,
      selectedEvent: selectedEvent,
      eventCount,
      EventId: selectedTime.value.id
    });
    if(insufficientSpots){
      this.setMessage('You have too many guests.')
    };
  };

  selectDate = (selectedDate) => {
    this.setState({ selectedDate, selectedTime: null, EventId: null, message: '' });
    let filteredEvents = this.state.events.filter((event) => {
      let d = new Date(event.date)
      return d.setHours(0,0,0,0) === selectedDate.value && this.props.calculateCount(event) < event.numberOfAttendees;
    });
    let timeOptions = [];
    filteredEvents.forEach((event) => {
      let d = hdate.prettyPrint(new Date(Date.parse(event.date)), {showTime: true});
      let splitDate = d.split(' ');
      let index = splitDate.indexOf('at') + 1;
      let remainingSpots = `${event.numberOfAttendees - this.props.calculateCount(event)} spots remaining`;
      timeOptions.push({ value: event, label: splitDate.splice(index).join(' ') + ` - ${remainingSpots}` });
    });
    this.setState({ timeOptions })
    if(this.state.initialLoad){
      let timeIndex = timeOptions.findIndex((time) => {
        return time.value.id === this.state.attendee.Event.id;
      });
      this.selectTime(timeOptions[timeIndex]);
      this.setState({ initialLoad: false });
    };
  };

  cancelBooking = () => {
    let url;
    if(process.env.NODE_ENV === 'development'){
      url = config.developmentUrl;
    } else {
      url = config.productionUrl;
    };
    axios.delete(`${url}/api/attendee/${this.state.attendee.id}`)
      .then((result) => {
        this.setState({cancelSuccess: true});
      })
      .catch((error) => {
      })
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

  handleGuestChange = (event, index) => {
    let guests = Object.assign([], this.state.guests);
    guests[index][event.target.name] = event.target.value;
    this.setState({ guests });
  };

  addGuest = () => {
    let eventSpace;
    if(this.state.selectedEvent.id === this.state.attendee.EventId){
      eventSpace = this.state.attendee.guests.length + this.state.selectedEvent.numberOfAttendees - this.state.eventCount - this.state.guests.length;
    } else {
      eventSpace = this.state.selectedEvent.numberOfAttendees - this.state.eventCount - this.state.guests.length - 1;
    };
    if(eventSpace > 0){
      let guests = Object.assign([], this.state.guests);
      guests.push({name: '', email: ''});
      this.setState({ guests });
    } else {
      this.setMessage('Not enough spots.');
    };
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

  handleUpdate = () => {
    const checkGuest = guest => guest.name;
    let options = {};
    let guests = this.state.guests.filter((guest) => {
      return guest.name || guest.email;
    });
    options.guests = guests;
    options.EventId = this.state.EventId ? this.state.EventId : this.state.attendee.Event.id;
    options.attendee = this.state.attendee;
    if(this.state.selectedDate && !this.state.selectedTime){
      this.setMessage('Please select a time.');
    } else if(!guests.every(checkGuest)){
      this.setMessage('Guest names are required.');
    } else {
      let url;
      if(process.env.NODE_ENV === 'development'){
        url = config.developmentUrl;
      } else {
        url = config.productionUrl;
      };
      axios.put(`${url}/api/attendee/${this.state.attendee.id}`, options)
        .then((result) => {
          this.setState({ updateSuccess: true });
        })
        .catch((error) => {
          this.setMessage('Sorry, we could not update your booking at this time.');
        })
    };
  };

  renderPrompt = () => {
    if(this.state.cancelSuccess){
      return(
        <div className="cancel-message-container">
          <p className="cancel-message"> Your booking has been cancelled! If you have guests, be sure to notify them if you did not register their emails! </p>
        </div>
      )
    } else if(this.state.updateSuccess){
      return(
        <div className="update-message-container">
          <p className="update-message"> Your booking has been successfully updated. If you have guests, be sure to notify them if you did not register their emails! </p>
        </div>
      )
    } else {
      return(
        <div className="cancel-edit-modal">
          <div className="booking-form">
            <div className="form-body" onClick={this.stopProp}>
              <h2 className="form-greeting"> Hi {this.state.attendee.name}! </h2>
              <p className="event-date-label"> You're signed up for {hdate.prettyPrint(new Date(Date.parse(this.state.attendee.Event.date)), {showTime: true})}. </p>
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
                  placeholder="Time"
                  value={this.state.selectedTime}
                  onChange={this.selectTime}
                  options={this.state.timeOptions}
                  isDisabled={!this.state.selectedDate}
                />
                {/*  */}
                {
                  this.state.selectedEvent.id ? <div className="availability"> {this.state.selectedEvent.numberOfAttendees - this.state.eventCount}/{this.state.selectedEvent.numberOfAttendees} Available </div> : <div className="availability-holder"></div>
                }
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
              <div className="submit-prompt-container" id="cancel-submit-prompt-container">
                <button className="submit-button" onClick={this.handleUpdate}> Update Booking </button>
                <button className="submit-button" onClick={this.cancelBooking}> Cancel Booking </button>
              </div>
            </div>
          </div>
        </div>
      )
    // eslint-disable-next-line
    };
  };

  renderNotFound = () => {
    if(!this.state.isLoading){
      return(
        <div>
          Sorry, there were no bookings found!
        </div>
      )
    };
  };

  render() {
    if(!this.state.isLoading){
      return(
        <div className="cancel-edit-container">
          {
            this.state.attendee.id ? this.renderPrompt() : this.renderNotFound()
          }
        </div>
      )
    } else {
      return(
        <div className="cancel-edit-container">
          Loading
        </div>
      )
    }
  };

};

export default CancelForm;
