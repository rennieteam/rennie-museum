import React, { Component } from 'react';
import validator from 'email-validator';
import axios from 'axios';
import config from './../config';

class EditAttendeeModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      message: ''
    }
  }

  componentDidMount = () => {
    const { name, email } = this.props.attendee;
    this.setState({ name, email });
  };

  handleChange = (event) => {
    const { target } = event;
    const newState = Object.assign({}, this.state);
    newState.message = '';
    newState[target.name] = target.value;
    this.setState(newState);
  };

  handleSubmit = () => {
    if(!this.state.name){
      this.setState({ message: 'Name is required!'});
    } else if(!validator.validate(this.state.email)){
      this.setState({ message: 'Please enter a valid email!' });
    } else {
      let payload = { name: this.state.name, email: this.state.email };
      let url;
      if(process.env.REACT_APP_ENV){
        url = config[process.env.REACT_APP_ENV];
      } else {
        url = config.development;
      };
      axios.post(`${url}/api/attendee/edit/${this.props.attendee.id}`, payload)
        .then((res) => {
          this.setState({ message: 'Attendee successfully updated.' })
          this.props.refreshUpdatedAttendee(res);
        })
        .catch((err) => {
          this.setState({ message: 'Error: Please try again later.' })
        })
    }
  };

  render = () => {
    return (
      <div className='edit-attendee-modal'>
        <i className="fas fa-times close-modal" onClick={this.props.cancelEditAttendee}/>
        <p> Edit Attendee </p>
        <p className='attendee-info'> {this.props.attendee.name} - {this.props.attendee.email} </p>
        <div className='edit-attendee-modal-inputs'>
          <p> Name </p>
          <p> Email </p>
          <input name='name' value={this.state.name} onChange={this.handleChange} />
          <input name='email' value={this.state.email} onChange={this.handleChange} />
          <button onClick={this.handleSubmit}> Update </button>
          <button onClick={this.props.cancelEditAttendee}> Cancel </button>
        </div>
        <p className='modal-message'> {this.state.message} </p>
      </div>
    )
  }
};

export default EditAttendeeModal;