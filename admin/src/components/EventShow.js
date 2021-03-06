import React, { Component } from 'react';
import axios from 'axios';
import config from './../config';
import qs from 'query-string';
import DateTimePicker from 'react-datetime-picker';
import EditAttendeeModal from './EditAttendeeModal';
import AddGuestForm from './AddGuestForm';
import { Ghost } from 'react-kawaii';
import moment from 'moment-timezone';

class EventShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      attendees: [],
      message: '',
      attendeesRemoval: {},
      error: null,
      success: null,
      modifyDate: false,
      isLoading: true,
      eventCount: null,
      numberOfAttendees: 0,
      date: null,
      editDate: false,
      emailList: '',
      notify: false,
      waiverList: [],
      noEvent: false,
      published: null,
      guestsRemoval: {},
      guestsAddition: {},
      overrideTracker: {},
      editAttendee: null
    };
  };

  componentDidMount = () => {
    setTimeout(() => {
      this.setEvents();
    }, 500);
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      setTimeout(() => {
        this.setEvents();
      }, 500);
    };
  };

  setEvents = () => {
    let hash = qs.parse(this.props.location.hash);
    let events = this.props.events.filter((event) => {
      return event.id === parseInt(hash.edit);
    });
    let waiverList = [];
    if(events.length){
      let eventCount = this.props.calculateCount(events[0]);
      let attendeesRemoval = {};
      for(let attendee of events[0].attendees){
        attendeesRemoval[attendee.id] = false;
        waiverList.push(attendee.name);
        if(attendee.guests.length){
          attendee.guests.forEach((guest) => {
            waiverList.push(guest.name);
          });
        };
      };
      this.setState({ published: events[0].published, noEvent: false, waiverList, event: events[0], isLoading: false, attendees: events[0].attendees, eventCount, numberOfAttendees: events[0].numberOfAttendees, attendeesRemoval});
    } else {
      this.setState({ noEvent: true, isLoading: false, message: 'Event not found.' });
    };
  };

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
    options.notify = this.state.notify;
    options.published = this.state.published;
    options.guestsRemoval = this.state.guestsRemoval;

    let guestError = false;
    let count = 0;

    let filteredAdditions = Object.assign({}, this.state.guestsAddition);

    for(let attendee in filteredAdditions){
      let f = filteredAdditions[attendee].filter((guest) => {
        if(!guest.name && guest.email){
          guestError = true;
        } else if(guest.name && !this.state.overrideTracker[attendee]){
          count++;
        };
        return guest.name || guest.email;
      });
      filteredAdditions[attendee] = f;
    };

    let checkDateDupe = this.props.events.find((event) => {
      return Date.parse(event.date) === Date.parse(this.state.date);
    });

    if(this.state.numberOfAttendees < this.state.eventCount){
      this.setState({ message: 'Capacity too low.' });
    } else if(checkDateDupe){
      this.setState({ message: 'Date and time already exists.' });
    } else if(guestError){
      this.setState({ message: 'Guest names are required.'});
    } else {
      let removal = this.state.attendeesRemoval;
      for(let attendee in removal){
        if(removal[attendee]){
          options.removal.push(parseInt(attendee));
        }
      };
      options.numberOfAttendees = this.state.numberOfAttendees;
      options.date = this.state.date;
      options.guestsAddition = filteredAdditions;
      options.EventId = this.state.event.id;
      options.count = count;
      let url;
      if(process.env.REACT_APP_ENV){
        url = config[process.env.REACT_APP_ENV];
      } else {
        url = config.development;
      };
      axios.put(`${url}/api/event/${this.state.event.id}`, options)
        .then((result) => {
          if(result.data.tooMany){
            this.setState({ message: 'Insufficient spots.' });
          } else {
            this.props.updateEvents(result.data);
            let attendees = result.data.update.attendees;
            this.setState({
              event: result.data.update,
              attendees: attendees,
              date: null,
              editDate: false,
              newDate: null,
              modifyDate: false,
              attendeesRemoval: [], 
              message: 'Event Updated',
              error: null,
              guestsRemoval: {},
              guestsAddition: {},
              overrideTracker: {}
            });
          };
        })
        .catch((error) => {
          this.setState({message: 'Unable to update event'})
        })
    }
  };

  markGuestForRemoval = (attendeeId, index) => {
    let guestsRemoval = Object.assign({}, this.state.guestsRemoval);
    if(guestsRemoval[attendeeId] === undefined){
      guestsRemoval[attendeeId] = {};
      guestsRemoval[attendeeId][index] = true;
    } else if(guestsRemoval[attendeeId][index]) {
      delete guestsRemoval[attendeeId][index];
    } else {
      guestsRemoval[attendeeId][index] = true;
    };
    this.setState({ guestsRemoval });
  };

  renderGuests = (guest, index, attendeeId) => {
    let email = '';
    if(guest.email){
      email = ` - ${guest.email}`;
    };
    let markedForRemove = this.state.guestsRemoval[attendeeId] && this.state.guestsRemoval[attendeeId][index];
    return(
      <div className="guest-container" key={index}>
        <span className={markedForRemove ? 'guest-name remove' : 'guest-name'}> {index + 1}. {guest.name}{email} </span>
        {
          markedForRemove ? 
          <span className="guest-cancel-remove" onClick={() => this.markGuestForRemoval(attendeeId, index)}> Cancel remove </span>
          :
          <i className="fas fa-times remove-guest-icon" onClick={() => this.markGuestForRemoval(attendeeId, index)} /> 
        }
      </div>
    )
  };

  addNewGuest = (attendeeId, overrideCount) => {
    let guestsAddition = Object.assign({}, this.state.guestsAddition);
    let overrideTracker = Object.assign({}, this.state.overrideTracker);
    if(guestsAddition[attendeeId] === undefined){
      guestsAddition[attendeeId] = [];
    };
    guestsAddition[attendeeId].push({name: '', email: ''});
    if(overrideCount){
      overrideTracker[attendeeId] = true;
    };
    this.setState({ guestsAddition, overrideTracker });
  };

  handleNewGuestChange = (event, attendeeId, index) => {
    let guestsAddition = Object.assign({}, this.state.guestsAddition);
    guestsAddition[attendeeId][index][event.target.name] = event.target.value;
    this.setState({ guestsAddition });
  };

  cancelNewGuest = (attendeeId, index) => {
    let guestsAddition = Object.assign({}, this.state.guestsAddition);
    let overrideTracker = Object.assign({}, this.state.overrideTracker);
    guestsAddition[attendeeId].splice(index, 1);
    if(!guestsAddition[attendeeId].length){
      delete guestsAddition[attendeeId];
      delete overrideTracker[attendeeId];
    };
    this.setState({ guestsAddition, overrideTracker });
  };

  editAttendeePrompt = (attendee) => {
    this.setState({ editAttendee: attendee });
  };

  renderAttendee = (attendee, index) => {
    let attendeeId = attendee.id;
    let designation = attendee.Designation ? attendee.Designation.name : 'n/a';
    return(
      <div className="attendee-container" key={index}>
        <span className={`name name-${this.state.attendeesRemoval[attendeeId]}`}> {attendee.name} </span>
        <span className="email"> {attendee.email} </span>
        <span className="designation"> Designation: {designation} </span>
        <div className="icon-container">
          {
            attendee.adminAdded ? <i className="fas fa-exclamation-circle admin-added" /> : ''
          }
          {
            attendee.overrideCount ? <i className="fas fa-user-times override-icon" /> : ''
          }
        </div>
        {
          attendee.guests.length ? <span className="guests-label"> Guests: </span> : ''
        }
        {
          attendee.guests.map((guest, index) => {
            return this.renderGuests(guest, index, attendeeId);
          })
        }
        {
          this.state.attendeesRemoval[attendeeId] ? 
            <span className="attendee-remove cancel-remove" onClick={() => this.markAttendeeForRemoval(attendeeId)}> Cancel Remove </span>
            :
            <i className="fas fa-times attendee-remove" onClick={() => this.markAttendeeForRemoval(attendeeId)}/>
        }
        {
          this.state.guestsAddition[attendeeId] ? 
          this.state.guestsAddition[attendeeId].map((guest, index) => {
            return(
            <div className="new-guest-input-container" key={index}>
              <input 
                className="new-guest-input"
                placeholder="Name*"
                onChange={(event) => this.handleNewGuestChange(event, attendeeId, index)}
                value={this.state.guestsAddition[attendeeId][index].name}
                name='name'
              />
              <input 
                className="new-guest-input"
                placeholder="Email"
                onChange={(event) => this.handleNewGuestChange(event, attendeeId, index)}
                value={this.state.guestsAddition[attendeeId][index].email}
                name='email'
              />
              <i className="fas fa-times cancel-add-guest" onClick={() => this.cancelNewGuest(attendeeId, index)}/>
            </div>
            )
          })
          :
          ''
        }
        <span className="add-new-guest" onClick={() => this.addNewGuest(attendee.id, attendee.overrideCount) }> Add Guest </span>
        <span className="edit-attendee" onClick={ () => this.editAttendeePrompt(attendee) }> Edit Attendee </span>
      </div>
    )
  };

  toggleDateEdit = () => {
    this.setState({ editDate: !this.state.editDate, date: null });
  };

  changeDate = date => this.setState({ date });

  renderDesignationInfo = () => {
    let count = {};
    this.props.designations.forEach((d) => {
      count[d.id] = 0;
    });
    this.state.attendees.forEach((attendee) => {
      if(attendee.DesignationId !== null){
        let n = attendee.guests.length + 1;
        count[attendee.DesignationId] += n;
      };
    });
    return(
      this.props.designations.map((designation) => {
        return (
          <div className="designation-count" key={designation.id}>
            {designation.name}: {count[designation.id]}
          </div>
        )
      })
    );
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
          <h2 className="event-header"> {moment(this.state.event.date).tz('America/Los_Angeles').format('MMMM Do, YYYY - h:mm a')} </h2>
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
          <p className="event-info remaining-spots"> Remaining Spots: {this.state.event.numberOfAttendees - this.state.eventCount} </p>
          <p className="event-info designations-header"> Designations: </p>
          {this.renderDesignationInfo()}
          { this.renderEditAttendeeModal() }
          <p className="event-info attendees-header"> Attendees: </p>
          {
            this.state.attendees.map((attendee, index) => {
              return(
                this.renderAttendee(attendee, index)
              )
            })
          }
          <div className="update-options-container">
            <div className="add-guest" onClick={this.toggleAddGuest}>
              <i className="fas fa-plus" />
              <span> Add Attendee </span>
            </div>
            {this.renderPublishPrompt()}
            {this.renderNotifyPrompt()}
          </div>
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

  waiverBody = (guests, index) => {
    return(
      <div className="waiver-container hidden" id="waiver-container" key={index}>
        <div className="print-waiver" id="print-waiver">
          <div className="waiver-header-container">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 199.999 21.181'>
              <g fill='#858688'><path d='m371.987 21.432-1.082-.263c-1.55-.38-2.6-.907-2.6-2.282 0-1.112.848-2.048 2.691-2.048a3.359 3.359 0 0 1 3.481 2.633l1.024-.2c-.585-2.574-2.516-3.715-4.943-3.715-3.393 0-5.236 2.253-5.236 4.739 0 2.165 1.17 3.6 4.007 4.359l1.082.293c1.258.351 2.457.79 2.457 2.428a2.546 2.546 0 0 1 -2.837 2.457 3.651 3.651 0 0 1 -3.861-3.277h-1.053c.322 3.072 2.486 4.564 5.324 4.564 3.452 0 5.733-2.311 5.733-5.178-.004-2.432-1.262-3.807-4.187-4.51z' transform='translate(-233.263 -9.935)'/><path d='m329.859 27.288a3.637 3.637 0 0 1 -3.1 2.253c-1.638 0-2.691-.936-2.691-3.072v-9.216h-3.656v9.654c0 3.247 1.989 5.237 4.885 5.237 3.159 0 4.271-2.867 4.592-3.832v3.569h3.627v-14.628h-3.656z' transform='translate(-204.704 -11.022)'/><path d='m269.492 16.524c-2.673 0-4.016 2.566-4.385 3.6a3.959 3.959 0 0 0 -4.186-3.6c-2.447 0-3.78 2.152-4.271 3.307v-3.044h-3.656v14.628h3.656v-10.515a3.11 3.11 0 0 1 2.6-1.777c1.433 0 2.311.907 2.311 2.779v9.508h3.656v-9.942l-.018-.531a3.124 3.124 0 0 1 2.621-1.81c1.433 0 2.311.907 2.311 2.779v9.508h3.656v-9.946c.005-3.247-1.662-4.944-4.295-4.944z' transform='translate(-161.633 -10.556)'/><path d='m512.737 16.524c-2.673 0-4.016 2.566-4.384 3.6a3.96 3.96 0 0 0 -4.186-3.6c-2.447 0-3.78 2.153-4.271 3.308v-3.045h-3.656v14.628h3.66v-10.51a3.11 3.11 0 0 1 2.6-1.777c1.434 0 2.311.907 2.311 2.779v9.508h3.656v-9.947l-.018-.531a3.125 3.125 0 0 1 2.621-1.81c1.433 0 2.311.907 2.311 2.779v9.508h3.656v-9.946c0-3.247-1.667-4.944-4.3-4.944z' transform='translate(-317.037 -10.556)'/><path d='m409.2 15.552a7.645 7.645 0 0 0 -7.488 7.782 7.645 7.645 0 0 0 7.488 7.782c3.627 0 6.172-2.633 6.786-6.173h-.936c-.819 2.428-2.4 4.125-4.622 4.125-2.165 0-4.826-1.082-4.856-6.407h10.5c-.351-4.739-3.247-7.109-6.872-7.109zm-3.539 6.114c.058-2.9 1.521-4.827 3.335-4.827 1.784 0 3.013 1.609 3.1 4.827z' transform='translate(-256.644 -9.935)'/><path d='m458.871 27.288a3.637 3.637 0 0 1 -3.1 2.253c-1.638 0-2.691-.936-2.691-3.072v-9.216h-3.656v9.654c0 3.247 1.989 5.237 4.885 5.237 3.159 0 4.271-2.867 4.592-3.832v3.569h3.627v-14.628h-3.656z' transform='translate(-287.127 -11.022)'/></g><g fill='#d60812'><path d='m203.467 24.936c-.794 2.421-2.381 4.129-4.609 4.129-2.162 0-4.81-1.1-4.842-6.406l10.486-.042c-.348-4.719-3.251-7.068-6.856-7.068a7.647 7.647 0 0 0 -7.5 7.781 7.647 7.647 0 0 0 7.5 7.783c3.615 0 6.165-2.65 6.759-6.178zm-6.036-8.088c1.8 0 3 1.563 3.108 4.773l-6.454.028c.075-2.874 1.549-4.8 3.346-4.8' transform='translate(-121.478 -9.934)'/><path d='m43.88 24.936c-.793 2.421-2.381 4.129-4.609 4.129-2.162 0-4.81-1.1-4.842-6.406l10.486-.042c-.348-4.719-3.252-7.068-6.856-7.068a7.647 7.647 0 0 0 -7.5 7.781 7.647 7.647 0 0 0 7.5 7.783c3.615 0 6.165-2.65 6.759-6.178zm-6.036-8.088c1.8 0 3 1.563 3.108 4.773l-6.452.029c.075-2.874 1.548-4.8 3.345-4.8' transform='translate(-19.521 -9.934)'/><path d='m90.927 31.367v-9.25c0-3.241-1.246-5.657-5.137-5.657-3.278 0-4.393 2.848-4.721 3.834v-3.574h-3.65v14.647h3.65v-10.049a3.078 3.078 0 0 1 2.9-2.264c2.421 0 3.2 1.5 3.2 3.519v8.794z' transform='translate(-49.461 -10.515)'/><path d='m138.434 31.367v-9.25c0-3.241-1.246-5.657-5.137-5.657-3.277 0-4.393 2.848-4.721 3.834v-3.574h-3.649v14.647h3.649v-10.049a3.079 3.079 0 0 1 2.9-2.264c2.421 0 3.2 1.5 3.2 3.519v8.794z' transform='translate(-79.813 -10.515)'/><path d='m62.394 6.223h3.65v14.629h-3.65z'/><path d='m173.644 4.734a2.367 2.367 0 1 0 -2.367-2.367 2.366 2.366 0 0 0 2.367 2.367' transform='translate(-109.425)'/><path d='m0 6.219h3.646v14.633h-3.646z'/><path d='m16.139 21.186a2.366 2.366 0 1 0 -2.365-2.365 2.366 2.366 0 0 0 2.365 2.365' transform='translate(-8.8 -10.512)'/></g>
            </svg>
            <p className="header-text"> visitor sign-in </p>
          </div>
          <div className="title-container">
            <p className="exhibit-name"> Barkley L. Hendricks and Lorna Simpson: Collected Works </p>
            <p className="date"> {moment(this.state.event.date).tz('America/Los_Angeles').format('MMMM Do, YYYY - h:mm a')} </p>
          </div>
          <p className="bold"> Waiver of Claims and Release of Liability </p>
          <p className="regular"> Visitors to the museum will enter and tour the museum at their own risk. Neither the museum, its affiliates, directors, or employees shall have any liability for any damages arising or related to your use of the site, content, and/or compilation. The museum will hold visitors liable for any damage done to the art or the museum. Visitors are asked to conduct themselves responsibly and to take care to not damage any art, the museum and other visitors. </p>
          <p className="bold list-header"> In particular we ask that visitors: </p>
          <ul>
            <li> Refrain from touching the art works (unless expressly invited to touch particular pieces). </li>
            <li> Understand the safety risks involved in handling materials pertaining to participatory artworks. </li>
            <li> Comply with all directions and requests of the museum guide and museum personnel. </li>
            <li> Not smoke in the museum or bring outside food or beverages into the museum. </li>
            <li> Not bring large bags or back-packs into the museum. </li>
          </ul>
          <p className="bold"> Visitors to the museum, by participating in a museum tour or by entering the museum, will be deemed to have agreed to comply with these terms and conditions. </p>
          <p className="bold"> The museum reserves the right to refuse entrance to any person. </p>
          <p className="bold release"> I have read this Waiver and Release and fully understand its terms and conditions. </p>
          <div className="form-fields header-fields">
            <p className="bold"> Name </p>
            <p className="bold"> Sign In </p>
            <p className="bold"> Sign Out </p>
          </div>
        {
          guests.map((attendee, index) => {
            return(
              <div className="form-fields" key={index + Math.random()}>
                <p className="regular form-fill"> {attendee} </p>
                <p className="form-fill"></p>
                <p className="form-fill"></p>
              </div>
            )
          })
        }
      </div>
    </div>
    )
  };

  renderWaiver = () => {
    let iteration = [];
    let list = this.state.waiverList;
    if(list.length <= 10){
      let emptyList = Array.from({ length: 5 });
      let remainder = 10 - list.length;
      if(remainder){
        Array.from({ length: remainder }).forEach(() => {
          list.push('');
        });
      };
      iteration.push(list);
      iteration.push(emptyList);
    } else {
      let count = Math.ceil(list.length / 10);
      let position = 0;
      for(let x = 0; x < count; x ++){
        let set = [];
        for(let y = 0; y < 10; y++){
          if(list[position]){
            set.push(list[position]);
            position++;
          } else {
            break;
          }
        }
        iteration.push(set);
      };
      let remainder = (count * 10) - list.length;
      if(remainder){
        for(let x = 0; x < remainder; x++){
          iteration[count-1].push('');
        };
      };
    };

    return(
      <div>
        {
          iteration.map((guestSet, index) => {
            return this.waiverBody(guestSet, index)
          })
        }
      </div>
    )
  };

  deleteBooking = () => {
    let confirm = window.confirm('Are you sure you want to delete this booking?');
    if(!confirm) return;
    let url;
    if(process.env.REACT_APP_ENV){
      url = config[process.env.REACT_APP_ENV];
    } else {
      url = config.development;
    };
    axios.delete(`${url}/api/event/${this.state.event.id}`)
      .then((result) => {
        this.props.updateEvents(result.data);
        this.setState({ message: 'Event canceled.', noEvent: true });
      })
      .catch(error => {
        this.setState({ message: 'Unable to cancel booking.'});
      })
  };

  printWaiver = () => {
    let waiver = document.getElementsByClassName('waiver-container');
    let formContainer = document.getElementById('form-outer-container');
    let nav = document.getElementById('admin-nav');
    formContainer.classList.add('hidden');
    nav.classList.add('hidden');

    for(let i = 0; i < waiver.length; i++){
      waiver[i].classList.remove('hidden');
    };
    window.addEventListener('afterprint', () => {
      for(let i = 0; i < waiver.length; i++){
        waiver[i].classList.add('hidden');
      };
      nav.classList.remove('hidden');
      formContainer.classList.remove('hidden');
    }); 

    setTimeout(() => {
      window.print();
    }, 500);
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
        <p className="menu-item print" onClick={this.printWaiver}> Print Waiver </p>
        <p className="menu-item" onClick={this.buildEmailList}> Copy Emails </p>
      </div>
    )
  };

  toggleNotify = (event) => {
    const target = event.target;
    const notify = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ notify });
  }

  renderNotifyPrompt = () => {
    return(
      <div className="notify-select">
        <input type="checkbox" id="notify-select" value={this.state.notify} onChange={this.toggleNotify}/>
        <label className="notify-select-label" htmlFor="notify-select"> Notify attendees. </label>
      </div>
    )
  };

  handlePublish = (event) => {
    this.setState({ published: event.target.checked });
  };

  renderPublishPrompt = () => {
    return(
      <div className="publish-select">
        <input 
          type="checkbox"
          id="publish-select"
          checked={this.state.published}
          onChange={this.handlePublish}
        />
        <label className="publish-select-label" htmlFor="publish-select"> Publish </label>
      </div>
    )
  };

  toggleAddGuest = () => {
    let form = document.querySelector('.add-guest-form');
    if(form.classList.contains('hidden')){
      form.classList.remove('hidden');
    } else {
      form.classList.add('hidden');
    };
  };

  renderLoading = () => {
    return (
      <div className="form-outer-container loading-container" id="form-outer-container">
        Loading
      </div>
    )
  };

  cancelEditAttendee = () => {
    this.setState({ editAttendee: null })
  };

  refreshUpdatedAttendee = (attendee) => {
    const { id, name, email } = attendee.data;
    const attendees = Object.assign([], this.state.attendees);
    for(let a of attendees){
      if(a.id !== id) continue;
      a.name = name;
      a.email = email;
    }
    this.setState({ attendees });
  }

  renderEditAttendeeModal = () => {
    if(this.state.editAttendee){
      return (
        <EditAttendeeModal
          attendee={this.state.editAttendee}
          cancelEditAttendee={this.cancelEditAttendee}
          refreshUpdatedAttendee={this.refreshUpdatedAttendee}
        />
      )
    }
  }

  renderFound = () => {
    return(
      <div className="form-outer-container" id="form-outer-container">
        <AddGuestForm 
          event={this.state.event}
          eventCount={this.state.eventCount}
          toggleAddGuest={this.toggleAddGuest}
          updateEvents={this.props.updateEvents}
          designations={this.props.designations}
        />
        <i className="menu-toggle fas fa-ellipsis-v" onClick={this.toggleMenu}/>
        {this.renderMenu()}
        {this.renderForm()}
        <div className="edit-button-container">
          <button className="update-button" onClick={this.updateEvent}> Update Tour </button>
          <button className="cancel-button" onClick={this.deleteBooking}> Cancel Tour </button>
        </div>
        {
          this.state.message ? <p className="form-message"> {this.state.message} </p> : ''
        }
    </div>
    )
  };

  renderNotFound = () => {
    return(
      <div className="form-outer-container" id="form-outer-container">
        <Ghost size={240} mood="ko" color="#E0E4E8" />
        {
          this.state.message ? <p className="form-message" id="not-found-message"> {this.state.message} </p> : ''
        }
      </div>
    )
  }

  render() {
    return(
      <div className="admin-edit-container">
        {
          this.state.isLoading ? this.renderLoading() : this.state.noEvent? this.renderNotFound() : this.renderFound() 
        }
        {this.renderWaiver()}
      </div>
    )
  }
}

export default EventShow;
