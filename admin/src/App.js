import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import qs from 'query-string';
import config from './config';

import CreateEventForm from './components/CreateEventForm';
import EventIndex from './components/EventIndex';
import EventShow from './components/EventShow';
import NavBar from './components/NavBar';
import MessageBox from './components/MessageBox';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      message: null,
      events: []
    };
  };

  componentDidMount = () => {
    axios.get(`${config[process.env.NODE_ENV]}/api/events/`)
      .then((result) => {
        this.setState({ events: result.data });
      })
      .catch((error) => {

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

  setMessage = (message) => {
    this.setState({message: message});
    setTimeout(() => {
      this.setState({message: null});
    }, 10000);
  };

  renderComponents = () => {
    let hash = qs.parse(this.props.location.hash);
    if(hash.newEvent){
      return(<Route path="/" render={(props) => <CreateEventForm {...props} setMessage={this.setMessage} /> } />)
    } else if(hash.index){
      return (<Route path="/" render={(props) => <EventIndex {...props} events={this.state.events} calculateCount={this.calculateCount} />  } />);
    } else if(hash.edit){
      return (<Route path="/" render={(props) => <EventShow {...props} setMessage={this.setMessage} calculateCount={this.calculateCount} events={this.state.events} /> } />) ;
    };
  };

  render() {
    // console.log(qp);
    return (
      <div className="App">
        <Route path="/" component={NavBar} />
        <MessageBox message={this.state.message} setMessage={this.setMessage} />
        {this.renderComponents()}
      </div>
    );
  }
}

export default App;
