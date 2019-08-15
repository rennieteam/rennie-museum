import React, { Component } from 'react';
import SettingToggle from './SettingToggle';
import axios from 'axios';
import config from '../config';
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
      submitStatus: ''
    };
  };

  componentDidMount = () => {
    this.setState({ settings: this.props.settings });
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.settings !== prevProps.settings){
      this.setState({ settings: this.props.settings })
    };
  };

  clearStatus = () => {
    this.setState({ submitStatus: '' });
  };

  toggleSwitch = (position) => {
    const newState = Object.assign({}, this.state);
    newState.settings[position].value = !this.state.settings[position].value;
    this.setState(newState);
    this.clearStatus();
  };
  
  handleContent = (event) => {
    let position = event.target.getAttribute('position');
    const newState = Object.assign({}, this.state);
    newState.settings[position].content = event.target.value;
    this.setState(newState);
    this.clearStatus();
  };
  
  handleUpdate = () => {
    let url;
    if(process.env.REACT_APP_ENV){
      url = config[process.env.REACT_APP_ENV];
    } else {
      url = config.development;
    };
    axios.post(`${url}/api/settings/update`, this.state)
      .then((result) => {
        this.setState({ submitStatus: 'settings updated.' });
      })
      .catch((error) => {
        this.setState({ submitStatus: 'error: could not update.' })
      })
  };

  render() {
    return (
      <div className="settings-container">
        {
          this.state.settings.map((setting, index) => {
            return(
              <SettingToggle
                key={setting.id}
                setting={setting}
                toggleSwitch={this.toggleSwitch}
                handleContent={this.handleContent}
                position={index}
              />
            )
          })
        }
        <button className="update-settings" onClick={this.handleUpdate}> Update </button>
        <p className="settings-submit-status"> {this.state.submitStatus} </p>
      </div>
    );
  }
}

export default Settings;
