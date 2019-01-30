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
      attendeesRemoval: {},
      error: null,
      modifyDate: false,
      isLoading: true,
      eventCount: null,
      numberOfAttendees: 0,
      date: null,
      editDate: false,
      emailList: ''
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
      let attendeesRemoval = {};
      for(let attendee of events[0].attendees){
        attendeesRemoval[attendee.id] = false;
      };
      this.setState({ event: events[0], attendees: events[0].attendees, isLoading: false, eventCount, numberOfAttendees: events[0].numberOfAttendees, attendeesRemoval});
    } else {
      this.setState({ isLoading: false });
    };
  }

  changeNumberOfAttendee = (event) => {
    this.setState({ numberOfAttendees: event.target.value });
  };

  markAttendeeForRemoval = (id) => {
    let markForRemoval = Object.assign({}, this.state.attendeesRemoval);
    markForRemoval[id] = !this.state.attendeesRemoval[id];
    this.setState({attendeesRemoval: markForRemoval});
  };

  updateEvent = () => {
    let options = {
      removal: []
    };

    let checkDateDupe = this.props.events.find((event) => {
      return Date.parse(event.date) === Date.parse(this.state.date);
    });

    if(this.state.numberOfAttendees < this.state.eventCount){
      this.setState({ message: 'Capacity too low.' })
    } else if(checkDateDupe){
      this.setState({ message: 'Date and time already exists.' })
    } else {
      let removal = this.state.attendeesRemoval;
      for(let attendee in removal){
        if(removal[attendee]){
          options.removal.push(parseInt(attendee));
        }
      };
      options.date = this.state.date;
      axios.put(`${config[process.env.NODE_ENV]}/api/event/${this.state.event.id}`, options)
        .then((result) => {
          let replace = this.props.events.find(function(element){
            return element.id === result.data.id;
          });
          let replaceIndex = this.props.events.indexOf(replace);
          let events = Object.assign([], this.props.events);
          events[replaceIndex] = result.data;
          this.props.updateEvents(events);
          let attendees = result.data.attendees;
          this.setState({event: result.data, attendees: attendees, date: null, editDate: false, newDate: null, modifyDate: false, attendeesRemoval: [], message: 'Event Updated', error: null})
        })
        .catch((error) => {
          this.setState({message: 'Unable to update event'})
        })
    }
  };

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
        <span className={`name name-${this.state.attendeesRemoval[attendee.id]}`}> {attendee.name} </span>
        <span className="email"> {attendee.email} </span>
        {
          attendee.guests.length ? <span className="guests-label"> Guests: </span> : ''
        }
        {
          attendee.guests.map((guest, index) => {
            return this.renderGuests(guest, index);
          })
        }
        {
          this.state.attendeesRemoval[attendee.id] ? 
            <span className="attendee-remove cancel-remove" onClick={() => this.markAttendeeForRemoval(attendee.id)}> Cancel Remove </span>
            :
            <i className="fas fa-times attendee-remove" onClick={() => this.markAttendeeForRemoval(attendee.id)}/>
        }
      </div>
    )
  };

  toggleDateEdit = () => {
    this.setState({ editDate: !this.state.editDate, date: null });
  };

  changeDate = date => this.setState({ date });
  
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
          {
            this.state.editDate ? 
              <DateTimePicker 
                onChange={this.changeDate}
                value={this.state.date}
              /> 
            : 
              ''
          }
          <p className="edit-date" onClick={this.toggleDateEdit}> {this.state.editDate ? 'cancel' : 'edit date'} </p>
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

  buildEmailList = () => {
    let emails = [];
    this.state.attendees.forEach((attendee) => {
      emails.push(attendee.email);
      if(attendee.guests.length){
        attendee.guests.forEach((guest) => {
          if(guest.email){
            emails.push(guest.email);
          };
        });
      };
    });
    let emailList = emails.join(', ');
    this.setState({emailList});
    this.copyEmailList();
  };

  copyEmailList = () => {
    var copy = document.createElement('textarea');
    let style = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '2em',
      height: '2em',
      padding: 0,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent'
    };
    copy.style = style;
    copy.value = this.state.emailList;
    document.body.appendChild(copy);
    copy.focus();
    copy.select();
    document.execCommand('copy');
    document.body.removeChild(copy);
  };

  toggleMenu = () => {
    let menu = document.getElementById('edit-menu');
    if(menu.classList.contains('hidden')){
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
  };

  renderMenu = () => {
    return(
      <div className="menu hidden" id="edit-menu">
        <i className="fas fa-times close-menu" onClick={this.toggleMenu}/>
        <p className="menu-item print"> Print Waiver </p>
        <p className="menu-item" onClick={this.buildEmailList}> Copy Emails </p>
      </div>
    )
  }

  render() {
    return(
      <div className="admin-edit-container">
        {/* <input className="email-list" id="email-list" value={this.state.emailList} readOnly={true}/> */}
        <i className="menu-toggle fas fa-ellipsis-v" onClick={this.toggleMenu}/>
        {this.renderMenu()}
        {this.renderForm()}
        <button className="update-button" onClick={this.updateEvent}> Update Tour </button>
        <button className="cancel-button"> Cancel Tour </button>
        {
          this.state.message ? <p className="form-message"> {this.state.message} </p> : ''
        }
        <button className='state' onClick={() => {console.log(this.state)}}> State </button>
      </div>
    )
  }
}

export default EventShow;
