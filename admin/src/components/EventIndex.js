import React, { Component } from 'react';
import axios from 'axios';
import config from './../config';
import hdate from 'human-date';

class EventIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  };

  componentDidMount = () => {
    // axios.get(`${config.development}/api/events`)
    axios.get(`${config[process.env.NODE_ENV]}/api/events`)
      .then((result) => {
        this.setState({events: result.data})
      });
  };

  setEditParams = (event_id) => {
    this.props.history.push({
      search: `?edit=true&event_id=${event_id}`
    })
  };

  render() {
    return (
      <div className="">
        {
          this.state.events.map((event) => {
            return(
              <div key={event.id}>
                { hdate.prettyPrint(new Date(Date.parse(event.date)), {showTime: true}) }
                <span onClick={() => this.setEditParams(event.id)}> Edit </span>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default EventIndex;