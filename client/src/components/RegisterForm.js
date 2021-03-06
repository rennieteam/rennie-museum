import React, {Component} from 'react';
import axios from 'axios';
import config from '../config.js';
import validator from 'email-validator';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      message: ''
    }
  };

  handleChange = (event) => {
    const newState = Object.assign({}, this.state, {
      [event.target.name]: event.target.value
    });
    this.setState(newState);
  };

  handleSubmit = () => {
    if(this.state.email && this.state.firstName && this.state.lastName){
      if(!validator.validate(this.state.email)){
        this.setState({ message: 'Please enter a valid email.' })
      } else {
        let url;
        if(process.env.REACT_APP_ENV){
          url = config[process.env.REACT_APP_ENV];
        } else {
          url = config.development;
        };
        axios.post(`${url}/api/attendee/register`, this.state)
          .then((result) => {
            this.setState({ email: '', firstName: '', lastName: '', message: 'Thank you for subscribing!'});
          })
          .catch((error) => {
            this.setState({ message: 'Sorry, please try again.'})
          })
      }
    } else {
      this.setState({ message: 'All fields are required.'});
    };
  };

  render(){
    return(
      <div className="register-container">
        <div className="register-modal">
          <div className="register-masthead">
            <svg className="logo" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 199.999 21.181'>
                <g fill='#858688'><path d='m371.987 21.432-1.082-.263c-1.55-.38-2.6-.907-2.6-2.282 0-1.112.848-2.048 2.691-2.048a3.359 3.359 0 0 1 3.481 2.633l1.024-.2c-.585-2.574-2.516-3.715-4.943-3.715-3.393 0-5.236 2.253-5.236 4.739 0 2.165 1.17 3.6 4.007 4.359l1.082.293c1.258.351 2.457.79 2.457 2.428a2.546 2.546 0 0 1 -2.837 2.457 3.651 3.651 0 0 1 -3.861-3.277h-1.053c.322 3.072 2.486 4.564 5.324 4.564 3.452 0 5.733-2.311 5.733-5.178-.004-2.432-1.262-3.807-4.187-4.51z' transform='translate(-233.263 -9.935)'/><path d='m329.859 27.288a3.637 3.637 0 0 1 -3.1 2.253c-1.638 0-2.691-.936-2.691-3.072v-9.216h-3.656v9.654c0 3.247 1.989 5.237 4.885 5.237 3.159 0 4.271-2.867 4.592-3.832v3.569h3.627v-14.628h-3.656z' transform='translate(-204.704 -11.022)'/><path d='m269.492 16.524c-2.673 0-4.016 2.566-4.385 3.6a3.959 3.959 0 0 0 -4.186-3.6c-2.447 0-3.78 2.152-4.271 3.307v-3.044h-3.656v14.628h3.656v-10.515a3.11 3.11 0 0 1 2.6-1.777c1.433 0 2.311.907 2.311 2.779v9.508h3.656v-9.942l-.018-.531a3.124 3.124 0 0 1 2.621-1.81c1.433 0 2.311.907 2.311 2.779v9.508h3.656v-9.946c.005-3.247-1.662-4.944-4.295-4.944z' transform='translate(-161.633 -10.556)'/><path d='m512.737 16.524c-2.673 0-4.016 2.566-4.384 3.6a3.96 3.96 0 0 0 -4.186-3.6c-2.447 0-3.78 2.153-4.271 3.308v-3.045h-3.656v14.628h3.66v-10.51a3.11 3.11 0 0 1 2.6-1.777c1.434 0 2.311.907 2.311 2.779v9.508h3.656v-9.947l-.018-.531a3.125 3.125 0 0 1 2.621-1.81c1.433 0 2.311.907 2.311 2.779v9.508h3.656v-9.946c0-3.247-1.667-4.944-4.3-4.944z' transform='translate(-317.037 -10.556)'/><path d='m409.2 15.552a7.645 7.645 0 0 0 -7.488 7.782 7.645 7.645 0 0 0 7.488 7.782c3.627 0 6.172-2.633 6.786-6.173h-.936c-.819 2.428-2.4 4.125-4.622 4.125-2.165 0-4.826-1.082-4.856-6.407h10.5c-.351-4.739-3.247-7.109-6.872-7.109zm-3.539 6.114c.058-2.9 1.521-4.827 3.335-4.827 1.784 0 3.013 1.609 3.1 4.827z' transform='translate(-256.644 -9.935)'/><path d='m458.871 27.288a3.637 3.637 0 0 1 -3.1 2.253c-1.638 0-2.691-.936-2.691-3.072v-9.216h-3.656v9.654c0 3.247 1.989 5.237 4.885 5.237 3.159 0 4.271-2.867 4.592-3.832v3.569h3.627v-14.628h-3.656z' transform='translate(-287.127 -11.022)'/></g><g fill='#d60812'><path d='m203.467 24.936c-.794 2.421-2.381 4.129-4.609 4.129-2.162 0-4.81-1.1-4.842-6.406l10.486-.042c-.348-4.719-3.251-7.068-6.856-7.068a7.647 7.647 0 0 0 -7.5 7.781 7.647 7.647 0 0 0 7.5 7.783c3.615 0 6.165-2.65 6.759-6.178zm-6.036-8.088c1.8 0 3 1.563 3.108 4.773l-6.454.028c.075-2.874 1.549-4.8 3.346-4.8' transform='translate(-121.478 -9.934)'/><path d='m43.88 24.936c-.793 2.421-2.381 4.129-4.609 4.129-2.162 0-4.81-1.1-4.842-6.406l10.486-.042c-.348-4.719-3.252-7.068-6.856-7.068a7.647 7.647 0 0 0 -7.5 7.781 7.647 7.647 0 0 0 7.5 7.783c3.615 0 6.165-2.65 6.759-6.178zm-6.036-8.088c1.8 0 3 1.563 3.108 4.773l-6.452.029c.075-2.874 1.548-4.8 3.345-4.8' transform='translate(-19.521 -9.934)'/><path d='m90.927 31.367v-9.25c0-3.241-1.246-5.657-5.137-5.657-3.278 0-4.393 2.848-4.721 3.834v-3.574h-3.65v14.647h3.65v-10.049a3.078 3.078 0 0 1 2.9-2.264c2.421 0 3.2 1.5 3.2 3.519v8.794z' transform='translate(-49.461 -10.515)'/><path d='m138.434 31.367v-9.25c0-3.241-1.246-5.657-5.137-5.657-3.277 0-4.393 2.848-4.721 3.834v-3.574h-3.649v14.647h3.649v-10.049a3.079 3.079 0 0 1 2.9-2.264c2.421 0 3.2 1.5 3.2 3.519v8.794z' transform='translate(-79.813 -10.515)'/><path d='m62.394 6.223h3.65v14.629h-3.65z'/><path d='m173.644 4.734a2.367 2.367 0 1 0 -2.367-2.367 2.366 2.366 0 0 0 2.367 2.367' transform='translate(-109.425)'/><path d='m0 6.219h3.646v14.633h-3.646z'/><path d='m16.139 21.186a2.366 2.366 0 1 0 -2.365-2.365 2.366 2.366 0 0 0 2.365 2.365' transform='translate(-8.8 -10.512)'/></g>
            </svg>
            <a href="#close" className="fas fa-times close-register-button">
              <span className="hidden">
                Close
              </span>
            </a>
          </div>
          <h2 className="register-header"> Subscribe to receive our newsletter. </h2>
          <p className="register-text"> To get immediate notification of this and all other <strong>rennie museum</strong> activities, please fill out the form below. We will never sell or share your personal information, including your name, email address and phone number. </p>
          <div className="register-inputs">
            <input className="name-input" name="firstName" placeholder='First Name*' value={this.state.firstName} onChange={this.handleChange}/>
            <input className="name-input" name="lastName" placeholder='Last Name*' value={this.state.lastName} onChange={this.handleChange}/>
            <input className="email-input" name='email' value={this.state.email} onChange={this.handleChange} placeholder='Email' />
          </div>
          {
            this.state.message ? <p className="register-message"> {this.state.message} </p> : ''
          }
          <button className="register-button" onClick={this.handleSubmit}> Register </button>
        </div>
      </div>
    )
  }

};

export default RegisterForm;
