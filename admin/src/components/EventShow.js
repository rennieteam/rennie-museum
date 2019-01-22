import React, { Component } from 'react';
import axios from 'axios';
import config from './../config';
import qs from 'query-string';
import hdate from 'human-date';
import DateTimePicker from 'react-datetime-picker';

class EventShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      attendees: [],
      message: '',
      attendeesRemoval: [],
      error: null,
      modifyDate: false,
      newDate: null
    };
  };
  
  componentDidMount = () => {
    let qp = qs.parse(this.props.location.search);
    axios.get(`${config[process.env.NODE_ENV]}/api/event/${qp.event_id}`)
      .then((result) => {
        this.setState({event: result.data, attendees: result.data.attendees});
      })
      .catch(error => this.setState({error: error}))
  };

  deleteEvent = () => {
    axios.delete(`${config[process.env.NODE_ENV]}/api/event/${this.state.event.id}`)
      .then((result) => {
        this.props.setMessage('Event Successfully Cancelled');
        this.props.history.push({
          search: ""
        })
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

  setDate = (date) => {
    this.setState({newDate: date});
  };

  renderAttendees = () => {
    return this.state.attendees.length ? (
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
    ) : '';
  };

  showDatePicker = () => {
    this.setState({modifyDate: true});
  };

  updateEvent = () => {
    axios.put(`${config[process.env.NODE_ENV]}/api/event/${this.state.event.id}`, this.state)
      .then((result) => {
        let attendees = result.data.attendees ? result.data.attendees : [];
        this.setState({event: result.data, attendees: attendees, newDate: null, modifyDate: false, attendeesRemoval: [], message: 'Event Updated', error: null})
      })
      .catch((error) => {
        this.setState({message: 'Unable to update event'})
      })
  };

  renderForm = () => {
    if(this.state.error){
      return(
        <div> Event Does Not Exist </div>
      )
    } else {
      return (
        <div className="">
          <h2> { hdate.prettyPrint(new Date(Date.parse(this.state.event.date)), {showTime: true}) } <span onClick={this.showDatePicker}> edit </span> </h2>
          {
            this.state.modifyDate ? <DateTimePicker onChange={this.setDate} value={this.state.newDate} /> : ''
          }
          <p> Number of Attendees: {this.state.event.numberOfAttendees} </p>
          { this.renderAttendees() }
          <button onClick={this.deleteEvent}> Cancel Event </button>
          <button onClick={this.updateEvent}> Update Event </button>
          {
            this.state.message ? <p> {this.state.message} </p> : ''
          }
        </div>
      );
    };
  };

  render() {
    return(
      <div>
        {this.renderForm()}
      </div>
    )
  }
}

export default EventShow;
