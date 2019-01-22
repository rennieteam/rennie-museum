import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import qs from 'query-string';

import CreateEventForm from './components/CreateEventForm';
import EventIndex from './components/EventIndex';
import EventShow from './components/EventShow';
import NavBar from './components/NavBar';
import MessageBox from './components/MessageBox';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      message: null
    };
  };

  setMessage = (message) => {
    this.setState({message: message});
    setTimeout(() => {
      this.setState({message: null});
    }, 10000);
  };

  renderComponents = () => {
    let qp = qs.parse(this.props.location.search);
    if(qp.newEvent){
      return(<Route path="/" render={(props) => <CreateEventForm {...props} setMessage={this.setMessage} /> } />)
    } else if(qp.index){
      return (<Route path="/" component={EventIndex} />);
    } else if(qp.edit){
      return (<Route path="/" render={(props) => <EventShow {...props} setMessage={this.setMessage} /> } />) ;
    };
  };

  render() {
    // console.log(qp);
    return (
      <div className="App">
        <Route path="/" component={NavBar} />
        <MessageBox message={this.state.message} setMessage={this.setMessage} />
        {this.renderComponents()}
        {/* <Route exact path="/events" component={EventIndex} /> */}
        {/* <Route exact path="/events/new" component={CreateEventForm} /> */}
        {/* <Route exact path="/event/:id" component={EventShow} /> */}
      </div>
    );
  }
}

export default App;
