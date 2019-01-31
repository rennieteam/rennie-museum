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

  componentDidMount = () => {
    let url;
    if(process.env.NODE_ENV === 'development'){
      url = config.developmentUrl;
    } else {
      url = config.productionUrl;
    };
    axios.get(`${url}/api/events`)
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
      }).catch(error => {
        console.log(error);
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

  // renderComponents = () => {
  //   let qp = qs.parse(this.props.location.search);
  //   if(qp.cancel){
  //     return(<Route path="/" render={(props) => <CancelForm {...props} /> } />)
  //   } else {
  //     return(<Route path="/" render={(props) => <BookingForm {...props} /> } />)
  //   };
  // };

  render() {
    let q = qs.parse(this.props.location.hash);
    return (
      <div className="App">
        <Route 
          path="/"
          render={(props) => <BookingForm {...props} calculateCount={this.calculateCount} events={this.state.events} dateOptions={this.state.dateOptions} />} />
        {
          q.cancel ? <Route path="/" render={(props) => <CancelForm {...props} calculateCount={this.calculateCount} events={this.state.events} dateOptions={this.state.dateOptions}  /> } /> : '' 
        }
        {
          q.register ? <Route path="/" component={RegisterForm} /> : ''
        }
        {/* {this.renderComponents()} */}
        {/* <Route exact path="/events" component={EventIndex} />
        <Route exact path="/event/cancel/:hash" component={CancelForm} /> */}
      </div>
    );
  }
}

export default App;
