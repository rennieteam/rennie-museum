import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import qs from 'query-string';

import CancelForm from './components/CancelForm';
import BookingForm from './components/BookingForm';
import RegisterForm from './components/RegisterForm';
import config from './config';
import hdate from 'human-date';
import axios from 'axios';
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
      let dateWithTime = new Date(event.date);
      let dateWithZeroedTime = dateWithTime.setHours(0,0,0,0);
      if(!dupCheck.includes(dateWithZeroedTime)){
        dateOptions.push({ value: dateWithZeroedTime, label: hdate.prettyPrint(new Date(Date.parse(event.date))) })
        dupCheck.push(dateWithZeroedTime);
      };
    });
    this.setState({ dateOptions });
    // let url;
    // if(process.env.NODE_ENV === 'development'){
    //   url = config.developmentUrl;
    // } else {
    //   url = config.productionUrl;
    // };
    // axios.get(`${url}/api/events`)
    //   .then((results) => {
    //     this.setState({ events: results.data });
    //     let dupCheck = [];
    //     let dateOptions = [];
    //     results.data.forEach((result) => {
    //       let dateWithTime = new Date(result.date);
    //       let dateWithZeroedTime = dateWithTime.setHours(0,0,0,0);
    //       if(!dupCheck.includes(dateWithZeroedTime)){
    //         dateOptions.push({ value: dateWithZeroedTime, label: hdate.prettyPrint(new Date(Date.parse(result.date))) })
    //         dupCheck.push(dateWithZeroedTime);
    //       };
    //     });
    //     this.setState({ dateOptions });
    //   }).catch(error => {
    //     console.log(error);
    //   })
  };

  componentDidMount = () => {
    let url;
    if(process.env.NODE_ENV === 'development'){
      url = config.developmentUrl;
    } else {
      url = config.productionUrl;
    };
    axios.get(`${url}/api/events`)
      .then((results) => {
        this.initializeData(results.data);
      }).catch(error => {
        console.log(error);
      })
  };

  updateEvents = events => this.setState({ events });

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
