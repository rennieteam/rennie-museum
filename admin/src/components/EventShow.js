import React, { Component } from 'react';
import axios from 'axios';
import config from './../config';

class EventShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      attendees: [],
      message: '',
      attendeesRemoval: [],
      error: null
    };
  };

  componentDidMount = () => {
    axios.get(`${config[process.env.NODE_ENV]}/api/event/${this.props.match.params.id}`)
      .then((result) => {
        this.setState({event: result.data, attendees: result.data.attendees});
      })
      .catch(error => this.setState({error: error}))
  };

  deleteEvent = () => {
    axios.delete(`${config[process.env.NODE_ENV]}/api/event/${this.props.match.params.id}`)
      .then((result) => {
        this.setState({message: 'Event Cancelled'});
      })
      .catch((error) => {
        this.setState({message: 'Could not cancel event'});
      })
  };

  markAttendeeForRemoval = (id) => {
    let markForRemoval = this.state.attendeesRemoval.slice(0);
    markForRemoval.push(id);
    this.setState({attendeesRemoval: markForRemoval});
  };

  renderAttendees = () => {
    return(
    <div>
      <p> Attendees: </p>
      {
        this.state.attendees.map((a) => {
        return(
          <div className="attendee-container" key={a.id}>
            {
              a.name
            }
            { a.guests.length > 0 ? <p> Guests </p> : '' }
            {
              a.guests.map((guest, index) => {
                return(
                  <span key={index}> {guest.name} </span>
                  )
                })
            }
            <button onClick={() => this.markAttendeeForRemoval(a.id)} disabled={this.state.attendeesRemoval.includes(a.id)}> Remove Attendee </button>
          </div>
        )
      })}

    </div>
    )
  }

  render() {
    if(this.state.error){
      return(
        <div> Event Does Not Exist </div>
      )
    } else {
      return (
        <div className="">
          <h2> Event {this.state.event.id} </h2>
          <p> Number of Attendees: {this.state.event.numberOfAttendees} </p>
          { this.renderAttendees() }
          <button onClick={this.deleteEvent}> Cancel Event </button>
          <button> Update Event </button>
          {
            this.state.message ? <p> {this.state.message} </p> : ''
          }
        </div>
      );
    }
  }
}

export default EventShow;
