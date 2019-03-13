import React, { Component } from 'react';
import EventSorter from './EventSorter';
import hdate from 'human-date';

class EventIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      sort: 'asc',
      dateSort: true,
      capSort: false
    };
  };

  componentDidMount = () => {
    this.setState({ events: this.props.events });
  };

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      this.setState({ events: this.props.events });
    };
  };

  sortEvents = (state) => {
    this.setState({ events: state });
  };

  render() {
    return (
      <div className="events-index-container">
        <EventSorter 
          activeSwitch={this.props.activeSwitch}
          toggleActive={this.props.toggleActive}
          updateEvents={this.props.updateEvents}
          sortEvents={this.sortEvents}
          events={this.state.events}
          calculateCount={this.props.calculateCount}
        />
        {
          this.state.events.map((event) => {
            let dateString = hdate.prettyPrint(new Date(Date.parse(event.date)), {showTime: true}).split('at ');
            let count = this.props.calculateCount(event);
            let max = event.numberOfAttendees;
            let attendeeCount = event.attendees.length;
            return(
              <div className="admin-event" key={event.id + dateString}>
                <p className="event-date"> {dateString[0]} </p>
                <p className="event-time"> {dateString[1]} </p>
                <p className="event-info"> Capacity: {count}/{max} </p>
                <p className="event-info"> Primary Attendees: {attendeeCount} </p>
                <p className="event-info"> Guests: {count - attendeeCount} </p>
                <a className="event-edit" href={`#edit=${event.id}`}> Edit </a>
                {
                  count >= max ? <div className="full-label"> Full </div> : '' 
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default EventIndex;