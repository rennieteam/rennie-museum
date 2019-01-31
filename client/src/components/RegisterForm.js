import React, {Component} from 'react';
import axios from 'axios';
import config from '../config.js';
import validator from 'email-validator';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: ''
    }
  };

  handleEmail = (event) => {
    const newState = Object.assign({}, this.state, {
      [event.target.name]: event.target.value
    });
    this.setState(newState);
  };

  handleSubmit = () => {
    if(this.state.email){
      if(!validator.validate(this.state.email)){
        this.setState({ message: 'Please enter a valid email.' })
      } else {
        let url;
        if(process.env.NODE_ENV){
          url = config.developmentUrl;
        } else {
          url = config.productionUrl;
        };
        axios.post(`${url}/api/attendee/register`, this.state)
          .then((result) => {
            this.setState({ email: '', message: 'Thank you for subscribing!'});
          })
          .catch((error) => {
            this.setState({ message: 'Sorry, please try again.'})
          })
      }
    } else {
      this.setState({ message: 'Please enter an email.'});
    };
  };

  render(){
    return(
      <div className="register-container">
        <div className="register-modal">
          <h2 className="register-header"> Register for the Rennie Museum mailing list. </h2>
          <input className="email-input" name='email' value={this.state.email} onChange={this.handleEmail} placeholder='Email' />
          {
            this.state.message ? <p className="register-message"> {this.state.message} </p> : ''
          }
          <button className="register-button" onClick={this.handleSubmit}> Register </button>
          <a href="#close" className="fas fa-times close-register-button">
            <span className="hidden">
              Close
            </span>
          </a>
        </div>
      </div>
    )
  }

};

export default RegisterForm;
