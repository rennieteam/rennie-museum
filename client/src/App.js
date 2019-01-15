import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import EventIndex from './components/EventIndex';
import CancelForm from './components/CancelForm';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Route exact path="/events" component={EventIndex} />
        <Route exact path="/event/cancel/:hash" component={CancelForm} />
      </div>
    );
  }
}

export default App;
