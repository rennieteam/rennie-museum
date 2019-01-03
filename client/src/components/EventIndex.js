import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import EventSignUpForm from './EventSignUpForm';

import config from '../config.js';

class EventIndex extends Component {
  constructor(props){
    super(props);
    this.state = {
      events: [],
      selectedEvent: null
    };
  }

  componentDidMount(){
    axios.get(`${config.API_URL}/api/events`)
      .then(data => {
        this.setState({events: data.data});
      });
  };

  signUp = (event) => {
    this.setState({selectedEvent: event});
  };

  closeForm = () => {
    this.setState({selectedEvent: null});
  };

  formatEventTime = (event) => {
    return (
      <div key={event.id} className = "event-date" onClick={() => this.signUp(event)}>
        <Moment format="YYYY/MM/DD HH:mm" date={event.date} />
        <p> Remaining Spots: { config.EVENT_MAX - event.numberOfAttendees } </p>
      </div>
    )
  };

  render() {
    return(
      <div className="event">
        <h2> Exhibit 1 </h2>
        {this.state.events.map((event) => {
          return (
            this.formatEventTime(event)
          )
        })}
        {
          this.state.selectedEvent ? <EventSignUpForm event={this.state.selectedEvent} closeForm={this.closeForm}/> : ''
        }
      </div>
    )
  };

};

export default EventIndex;