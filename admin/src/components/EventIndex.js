import React, { Component } from 'react';
import axios from 'axios';
import config from './../config';

class EventIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  };

  componentDidMount = () => {
    axios.get(`${config[process.env.NODE_ENV]}/api/events`)
      .then((result) => {
        this.setState({events: result.data})
      });
  }

  render() {
    console.log(this.state.events)
    return (
      <div className="">
        {
          this.state.events.map((event) => {
            return(
              <div key={event.id}>
                {event.id}
                <a href={`event/${event.id}`}> Edit </a>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default EventIndex;
