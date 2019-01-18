import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import qs from 'query-string';

// import EventIndex from './components/EventIndex';
import CancelForm from './components/CancelForm';
import BookingForm from './components/BookingForm';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {

    };
  };

  renderComponents = () => {
    let qp = qs.parse(this.props.location.search);
    if(qp.cancel){
      return(<Route path="/" render={(props) => <CancelForm {...props} /> } />)
    } else {
      return(<Route path="/" render={(props) => <BookingForm {...props} /> } />)
    }
  };

  render() {
    let q = qs.parse(this.props.location.hash);
    return (
      <div className="App">
        <Route path="/" render={(props) => <BookingForm {...props}/>} />
        {
          q.cancel ? <Route path="/" render={(props) => <CancelForm {...props} /> } /> : '' 
        }
        {/* {this.renderComponents()} */}
        {/* <Route exact path="/events" component={EventIndex} />
        <Route exact path="/event/cancel/:hash" component={CancelForm} /> */}
      </div>
    );
  }
}

export default App;
