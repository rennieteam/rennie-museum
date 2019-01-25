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
      newDate: null,
      isLoading: true,
      eventCount: null,
      numberOfAttendees: 0
    };
  };

  componentDidMount = () => {
    this.setEvents();
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      this.setEvents();
    };
  };

  setEvents = () => {
    let hash = qs.parse(this.props.location.hash);
    let events = this.props.events.filter((event) => {
      return event.id === parseInt(hash.edit);
    });
    if(events.length){
      let eventCount = this.props.calculateCount(events[0]);
      this.setState({ event: events[0], attendees: events[0].attendees, isLoading: false, eventCount, numberOfAttendees: events[0].numberOfAttendees });
    } else {
      this.setState({ isLoading: false });
    };
  }

  // deleteEvent = () => {
  //   axios.delete(`${config[process.env.NODE_ENV]}/api/event/${this.state.event.id}`)
  //     .then((result) => {
  //       this.props.setMessage('Event Successfully Cancelled');
  //       this.props.history.push({
  //         search: ""
  //       })
  //     })
  //     .catch((error) => {
  //       this.setState({message: 'Could not cancel event'});
  //     })
  // };

  changeNumberOfAttendee = (event) => {
    this.setState({ numberOfAttendees: event.target.value });
  };

  markAttendeeForRemoval = (id) => {
    let markForRemoval = this.state.attendeesRemoval.slice(0);
    markForRemoval.push(id);
    this.setState({attendeesRemoval: markForRemoval});
  };

  // setDate = (date) => {
  //   this.setState({newDate: date});
  // };

  // renderAttendees = () => {
  //   return this.state.attendees.length ? (
  //   <div>
  //     <p> Attendees: </p>
  //     {
  //       this.state.attendees.map((a) => {
  //       return(
  //         <div className="attendee-container" key={a.id}>
  //           {
  //             a.name
  //           }
  //           { a.guests.length > 0 ? <p> Guests </p> : '' }
  //           {
  //             a.guests.map((guest, index) => {
  //               return(
  //                 <span key={index}> {guest.name} </span>
  //                 )
  //               })
  //           }
  //           <button onClick={() => this.markAttendeeForRemoval(a.id)} disabled={this.state.attendeesRemoval.includes(a.id)}> Remove Attendee </button>
  //         </div>
  //       )
  //     })}

  //   </div>
  //   ) : '';
  // };

  // showDatePicker = () => {
  //   this.setState({modifyDate: true});
  // };

  // updateEvent = () => {
  //   axios.put(`${config[process.env.NODE_ENV]}/api/event/${this.state.event.id}`, this.state)
  //     .then((result) => {
  //       let attendees = result.data.attendees ? result.data.attendees : [];
  //       this.setState({event: result.data, attendees: attendees, newDate: null, modifyDate: false, attendeesRemoval: [], message: 'Event Updated', error: null})
  //     })
  //     .catch((error) => {
  //       this.setState({message: 'Unable to update event'})
  //     })
  // };

  // renderForm = () => {
  //   if(this.state.error){
  //     return(
  //       <div> Event Does Not Exist </div>
  //     )
  //   } else {
  //     return (
  //       <div className="">
  //         <h2> { hdate.prettyPrint(new Date(Date.parse(this.state.event.date)), {showTime: true}) } <span onClick={this.showDatePicker}> edit </span> </h2>
  //         {
  //           this.state.modifyDate ? <DateTimePicker onChange={this.setDate} value={this.state.newDate} /> : ''
  //         }
  //         <p> Number of Attendees: {this.state.event.numberOfAttendees} </p>
  //         { this.renderAttendees() }
  //         <button onClick={this.deleteEvent}> Cancel Event </button>
  //         <button onClick={this.updateEvent}> Update Event </button>
  //         {
  //           this.state.message ? <p> {this.state.message} </p> : ''
  //         }
  //       </div>
  //     );
  //   };
  // };

  renderGuests = (guest, index) => {
    let email = '';
    if(guest.email){
      email = ` - ${guest.email}`;
    };
    return(
      <div className="guest-container" key={index}>
        <span className="guest-name"> {index + 1}. {guest.name}{email} </span>
      </div>
    )
  };

  renderAttendee = (attendee, index) => {
    return(
      <div className="attendee-container" key={index}>
        <span className="name"> {attendee.name} </span>
        <span className="email"> {attendee.email} </span>
        {
          attendee.guests.length ? <span className="guests-label"> Guests: </span> : ''
        }
        {
          attendee.guests.map((guest, index) => {
            return this.renderGuests(guest, index);
          })
        }
        <i className="fas fa-times attendee-remove" onClick={() => this.markAttendeeForRemoval(attendee.id)}/>
      </div>
    )
  };

  renderForm = () => {
    if(this.state.isLoading){
      return(
        <div className="loading-container"> Loading </div>
      )
    } else if(!this.state.event){
      return(
        <div> Event not found. </div>
      )
    } else {
      return(
        <div className="edit-form">
          <h2 className="event-header"> {hdate.prettyPrint(new Date(Date.parse(this.state.event.date)), {showTime: true})} </h2>
          <p className="event-info"> Max Capacity:
            <input 
              className="number-of-attendee-input"
              value={this.state.numberOfAttendees}
              placeholder={this.state.event.numberOfAttendees}
              onChange={this.changeNumberOfAttendee}  
            /> 
          </p>
          <p className="event-info total-attending"> Total Attending: {this.state.eventCount} </p>
          <p className="event-info attendees-header"> Attendees: </p>
          {
            this.state.attendees.map((attendee, index) => {
              return(
                this.renderAttendee(attendee, index)
              )
            })
          }
        </div>
      )
    }
  };

  render() {
    return(
      <div className="admin-edit-container">
        {this.renderForm()}
        <button className="update-button"> Update Tour </button>
        <button className="cancel-button"> Cancel Tour </button>
        <button className='state' onClick={() => {console.log(this.state)}}> State </button>
      </div>
    )
  }
}

export default EventShow;
