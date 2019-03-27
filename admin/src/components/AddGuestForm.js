import React, { Component } from 'react';
import config from './../config';
import axios from 'axios';
import moment from 'moment-timezone';
import Select from 'react-select';

let defaultState = {
  guests: [{name: '', email: ''}],
  name: '',
  email: '',
  overrideCount: false,
  notifyAttendee: false,
  message: '',
  designation: null
};

class AddGuestForm extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  };

  componentDidMount = () => {
    let designationOptions = [];
    this.props.designations.forEach((designation) => {
      designationOptions.push({ value: designation.id, label: designation.name });
    });
    this.setState({ designationOptions });
  };

  handleChange = (event) => {
    const state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  handleCheck = (event) => {
    let value = event.target.checked;
    let obj = {};
    obj[event.target.name] = value;
    this.setState(obj);
  };

  handleGuestChange = (event, index) => {
    let guests = Object.assign([], this.state.guests);
    guests[index][event.target.name] = event.target.value;
    this.setState({ guests });
  };

  handleDesignation = (designation) => {
    this.setState({ designation });
  };

  handleSubmit = () => {
    let body = {};
    let guests = this.state.guests.filter((guest) => {
      return guest.name || guest.email;
    });
    const checkGuests = guest => guest.name;
    let count = guests.length + 1;
    if(this.props.eventCount < count && !this.state.overrideCount){
      this.setState({ message: 'Insufficient spots!' });
    } else if(!this.state.name || !this.state.email) {
      this.setState({ message: 'Attendee name and email are required!' })
    } else if(!guests.every(checkGuests)){
      this.setState({ message: 'Guest names are required!' });
    } else if(!this.state.designation) {
      this.setState({ message: 'Please select a designation. '});
    } else {
      body.EventId = this.props.event.id;
      ['name', 'email', 'overrideCount'].forEach((param) => {
        body[param] = this.state[param];
      });
      let url;
      if(process.env.NODE_ENV === 'development'){
        url = config.development;
      } else {
        url = config.production;
      };
      let d = moment(this.props.event.date).tz('America/Los_Angeles').format('MMMM Do, YYYY - h:mm a');
      body.guests = guests;
      body.eventDate = d;
      body.adminAdded = true;
      body.notifyAttendee = this.state.notifyAttendee;
      body.designation = this.state.designation;
      axios.post(`${url}/api/attendees`, body)
        .then((result) => {
          if(result.data.success){
            this.props.updateEvents(result.data);
            let state = Object.assign({}, defaultState);
            state.message = 'Attendee added.';
            state.guests = [{name: '', email: ''}];
            this.setState(state);
          } else if(result.data.full){
            this.setState({ message: 'Error: Fully booked.' });
          } else if(result.data.tooMany){
            this.setState({ message: 'Error: Insufficient spots.' });
          } else if(result.data.emailUsed){
            this.setState({ message: 'Error: Email already registered for this event.' });
          }
        })
        .catch(error => {
          this.setState({ message: 'Error: Could not book at this time. '});
        }) 
    };
  };

  removeGuest = (index) => {
    if(this.state.guests.length === 1){
      this.setState({ guests: [] });
    } else {
      let guests = Object.assign([], this.state.guests);
      guests.splice(index, 1);
      this.setState({ guests });
    };
  };

  guestInput = (guest, index) => {
    const params = [{value: 'name', req: true}, {value: 'email', req: false}];
    return(
      <div className="guest-container" key={index}>
        {
          params.map((param) => {
            let req = param.req ? '*' : '';
            return(
              <input
                key={param.value}
                name={param.value}
                placeholder={`Guest ${param.value}${req}`}
                onChange={(event) => this.handleGuestChange(event, index)}
                value={this.state.guests[index][param.value]}
              />
            )
          })
        }
        <i className="fas fa-times remove-guest" onClick={() => this.removeGuest(index)} />
      </div>
    )
  };

  addGuest = () => {
    let guests = Object.assign([], this.state.guests);
    guests.push({name: '', email: ''});
    this.setState({ guests });
  };

  cancelForm = () => {
    this.setState(defaultState);
    this.setState({guests: [{name: '', email: ''}]});
    this.props.toggleAddGuest();
  };

  render = () => {
    return (
      <div className="add-guest-form hidden">
        <i className="fas fa-times close-form" onClick={this.cancelForm}/>
        <p className="title"> Add Attendee </p>
        <div className="infobox">
          <p className="info"> Remaining Spots: {this.props.event.numberOfAttendees - this.props.eventCount} </p>
        </div>
        <Select 
          className="designation-select"
          placeholder="Please select a designation."
          options={this.state.designationOptions}
          onChange={this.handleDesignation}
          value={this.state.designation}
        />
        <div className="guest-inputs">
          <input 
            className="attendee-input" 
            placeholder="Name*"
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
          />
          <input 
            className="attendee-input" 
            placeholder="Email*"
            name="email"
            onChange={this.handleChange}
            value={this.state.email}
          />
          {
            this.state.guests.map( (guest,index) => this.guestInput(guest,index) )
          }
          <div className="add-guest" onClick={this.addGuest}>
            <i
              className="fas fa-plus"
            />
            <span> Add Guest </span>
          </div>
          <div className="override">
            <input
              name="overrideCount"
              type="checkbox" 
              onChange={this.handleCheck}
              checked={this.state.overrideCount}
            />
            <label> Override Count </label>
          </div>
          <div className="notify">
            <input
              name="notifyAttendee"
              type="checkbox" 
              onChange={this.handleCheck}
              checked={this.state.notifyAttendee}
            />
            <label> Notify Attendee </label>
          </div>
          <div className="form-action" onClick={this.handleSubmit}>
            Add Attendee
          </div>
          <div className="form-action" onClick={this.cancelForm}>
            Cancel
          </div>
          <div className="message">
            {this.state.message}
          </div>
        </div>
      </div>
    );
  }
};

export default AddGuestForm;
