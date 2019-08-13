import React, { Component } from 'react';
import Switch from 'react-toggle-switch';

class SettingToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  };

  render() {
    return (
      <div className={`setting ${this.props.setting.isToggle ? 'toggle-setting' : 'non-toggle'}`}>
        <p className="setting-label"> {this.props.setting.name} </p>
        {
          this.props.setting.isToggle ?
            <Switch
              className="setting-toggle-switch"
              on={this.props.setting.value}
              onClick={() => this.props.toggleSwitch(this.props.position)}
            />
              :
            <textarea 
              type="text"
              className="setting-textarea"
              onChange={this.props.handleContent}
              position={this.props.position}
              value={this.props.setting.content}
            />
        }
      </div>
    );
  }
}

export default SettingToggle;
