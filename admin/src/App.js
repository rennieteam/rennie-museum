import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import CreateEventForm from './components/CreateEventForm';
import EventIndex from './components/EventIndex';
import EventShow from './components/EventShow';
import NavBar from './components/NavBar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Route exact path="/events" component={EventIndex} />
        <Route exact path="/events/new" component={CreateEventForm} />
        <Route exact path="/event/:id" component={EventShow} />
      </div>
    );
  }
}

export default App;
