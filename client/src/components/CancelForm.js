import React, { Component } from 'react';
import axios from 'axios';
import qs from 'query-string';
// import Moment from 'react-moment';

import config from '../config.js';

class CancelForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      attendee: {},
      cancelSuccess: false,
      errorMessage: false,
      guests: []
    };
  }

  componentDidMount = () => {
    let q = qs.parse(this.props.location.hash);
    axios.get(`${config.API_URL}/api/attendee/${q.cancel}`)
      .then((result) => {
        this.setState({attendee: result.data, guests: result.data.guests});
      })
      .catch((error) => {

      })
  };

  cancelBooking = () => {
    axios.delete(`${config.API_URL}/api/attendee/${this.state.attendee.id}`)
      .then((result) => {
        this.setState({cancelSuccess: true});
      })
      .catch((error) => {
        this.setState({errorMessage: true});
      })
  };

  renderPrompt = () => {
    console.log(this.state.attendee)
    if(!this.state.cancelSuccess){
      return(
        <div>
          <h2> Hello {this.state.attendee.name}! </h2>
          {
            this.state.attendee.length ? <h3> Guests </h3> : ''
          }
          {
            this.state.guests.map((guest) => {
              return(
                <div>
                  {guest.name}
                </div>
              )
            })
          }
          <button> Add Guest </button>
          <button onClick={this.cancelBooking}> Cancel Booking </button>
          <button> Update Booking </button>
          {
            this.state.errorMessage ? <p> Error </p> : ''
          }
        </div>
      )
    } else {
      return(
        <div>
          <h2> Your booking has been cancelled! If you have guests, be sure to notify them if you did not register their emails! You can book another tour <a href="/events"> here </a>! </h2>
        </div>
      )
    }
  };

  renderNotFound = () => {
    return(
      <div>
        Sorry, there were no bookings found!
      </div>
    )
  };

  render() {
    return(
      <div className="">
        {
          this.state.attendee ? this.renderPrompt() : this.renderNotFound()
        }
      </div>
    )
  };

};

export default CancelForm;