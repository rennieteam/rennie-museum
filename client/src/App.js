import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import qs from 'query-string';

import CancelForm from './components/CancelForm';
import BookingForm from './components/BookingForm';
import RegisterForm from './components/RegisterForm';
import config from './config';
import axios from 'axios';
import moment from 'moment-timezone';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      events: [],
      dateOptions: [],
      timeOptions: [],
      selectedDate: null,
      guests: [{name: '', email: ''}],
    };
  };

  initializeData = (events) => {
    this.setState({ events });
    let dupCheck = [];
    let dateOptions = [];
    events.forEach((event) => {
      let formattedDate = moment(event.date).tz('America/Los_Angeles').startOf('day').format();
      if(!dupCheck.includes(formattedDate)){
        dateOptions.push({ value: formattedDate, label: moment(event.date).tz('America/Los_Angeles').format('MMMM Do, YYYY') });
        dupCheck.push(formattedDate);
      };
    });
    this.setState({ dateOptions });
  };

  componentDidMount = () => {
    let url;
    if(process.env.NODE_ENV === 'development'){
      url = config.developmentUrl;
    } else {
      url = config.productionUrl;
    };
    axios.get(`${url}/api/coming_events`)
      .then((results) => {
        this.initializeData(results.data);
      }).catch(error => {
        console.log(error);
      })
  };

  updateEvents = events => this.setState({ events });

  calculateCount = (event = {}) => {
    let attendees;
    if(event.attendees){
      attendees = event.attendees.filter((event) => {
        return !event.overrideCount;
      });
    };
    let eventCount = event.attendees && attendees.length;
    if(eventCount >= event.numberOfAttendees){
      return eventCount;
    } else {
      attendees.forEach((attendee) => {
        eventCount += attendee.guests.length;
      });
    };
    return eventCount;
  };

  render() {
    let q = qs.parse(this.props.location.hash);
    
    return (
      <div className="App">
        <Route 
          path="/"
          render={(props) => <BookingForm {...props} initializeData={this.initializeData} updateEvents={this.updateEvents} calculateCount={this.calculateCount} events={this.state.events} dateOptions={this.state.dateOptions} />} />
        {
          'cancel' in q ? <Route path="/" render={(props) => <CancelForm {...props} calculateCount={this.calculateCount} events={this.state.events} dateOptions={this.state.dateOptions}  /> } /> : '' 
        }
        {
          'register' in q ? <Route path="/" component={RegisterForm} /> : ''
        }
      </div>
    );
  }
}

export default App;
