import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import qs from 'query-string';
import config from './config';

import CreateEventForm from './components/CreateEventForm';
import EventIndex from './components/EventIndex';
import EventShow from './components/EventShow';
import NavBar from './components/NavBar';
import Settings from './components/Settings';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      message: null,
      events: [],
      active: [],
      archived: [],
      toggleActive: true,
      designations: [],
      eventTypes: []
    };
  };

  componentDidMount = () => {
    let url;
    if(process.env.REACT_APP_ENV){
      url = config[process.env.REACT_APP_ENV];
    } else {
      url = config.development;
    };
    axios.get(`${url}/api/events/`)
      .then((result) => {
        this.setState({ 
          events: result.data.active,
          active: result.data.active,
          archived: result.data.archived,
          designations: result.data.designations,
          eventTypes: result.data.eventTypes
        });
      })
      .catch((error) => {
      })
  };

  updateEventTypes = (eventTypes) => {
    this.setState({ eventTypes });
  };

  activeSwitch = () => {
    if(this.state.toggleActive){
      this.setEvents(this.state.archived);
    } else {
      this.setEvents(this.state.active);
    };
    this.setState({toggleActive: !this.state.toggleActive});
  };

  updateEvents = (events) => {
    this.setState({
      events: this.state.toggleActive ? events.active : events.archived,
      active: events.active,
      archived: events.archived
    });
  };

  setEvents = (events) => {
    this.setState({events});
  };

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

  setMessage = (message) => {
    this.setState({message: message});
    setTimeout(() => {
      this.setState({message: null});
    }, 10000);
  };

  renderComponents = () => {
    let hash = qs.parse(this.props.location.hash);
    if('newEvent' in hash){
      return(<Route 
              path="/" 
              render={(props) => 
                <CreateEventForm 
                  {...props} 
                  events={this.state.events} 
                  setMessage={this.setMessage} 
                  updateEvents={this.updateEvents} /> } />)
    } else if('index' in hash){
      return (<Route 
                path="/" 
                render={(props) => 
                  <EventIndex 
                    {...props}
                    activeSwitch={this.activeSwitch}
                    toggleActive={this.state.toggleActive}
                    updateEvents={this.updateEvents}
                    events={this.state.events} 
                    calculateCount={this.calculateCount} />  } />);
    } else if('edit' in hash){
      return (<Route 
                path="/" 
                render={(props) => 
                  <EventShow 
                    {...props}
                    designations={this.state.designations}
                    setMessage={this.setMessage} 
                    updateEvents={this.updateEvents} 
                    calculateCount={this.calculateCount} 
                    events={this.state.events} /> } />);
    } else if('settings' in hash){
      return (<Route 
        path="/" 
        render={(props) => 
          <Settings 
            {...props}
            updateEventTypes={this.updateEventTypes}
            eventTypes={this.state.eventTypes} /> } />);
    }
  };

  render() {
    return (
      <div className="App">
        <Route path="/" component={NavBar} />
        {this.renderComponents()}
      </div>
    );
  }
}

export default App;
