import React, { Component } from 'react';
import EventSorter from './EventSorter';
import moment from 'moment-timezone';

class EventIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      sort: 'asc',
      dateSort: true,
      capSort: false,
      published: null
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

  sortPublished = (state) => {
    this.setState({ published: state });
  };

  render() {
    let events = [];
    if(this.state.published === null || this.state.published.value === 'all'){
      events = this.state.events;
    } else {
      events = this.state.events.filter((event) => {
        if(this.state.published.value === 'published'){
          return event.published;
        } else {
          return !event.published;
        };
      });
    };
    return (
      <div className="events-index-container">
        <EventSorter 
          activeSwitch={this.props.activeSwitch}
          toggleActive={this.props.toggleActive}
          updateEvents={this.props.updateEvents}
          sortEvents={this.sortEvents}
          events={this.state.events}
          calculateCount={this.props.calculateCount}
          sortPublished={this.sortPublished}
          published={this.state.published}
        />
        {
          events.map((event) => {
            let formattedDate = moment(event.date).tz('America/Los_Angeles');
            let count = this.props.calculateCount(event);
            let max = event.numberOfAttendees;
            let regularAttendees = event.attendees.filter((attendee) => {
              return !attendee.overrideCount;
            });
            let status = event.published ? 'published' : 'draft';
            let ovGuest = 0;
            let overrideAttendees = event.attendees.filter((attendee) => {
              if(attendee.overrideCount){
                ovGuest += attendee.guests.length;
                return attendee;
              };
            });
            return(
              <div className="admin-event" key={event.id}>
                <p className="event-date"> {formattedDate.format('MMMM Do, YYYY')} </p>
                <p className="event-time"> {formattedDate.format('h:mm a')} </p>
                <p className="event-info"> Capacity: {count}/{max} </p>
                <p className="event-info"> Primary Attendees: {regularAttendees.length} </p>
                <p className="event-info"> Guests: {count - regularAttendees.length} </p>
                <p className="event-info"> Primary Overrides: {overrideAttendees.length} </p>
                <p className="event-info"> Guest Overrides: {ovGuest} </p>
                <p className="event-info"> Total: {ovGuest + count + overrideAttendees.length} </p>
                <a className="event-edit" href={`#edit=${event.id}`}> Edit </a>
                {
                  count >= max ? <div className="full-label"> Full </div> : '' 
                }
                {
                  <div className={status}> { status } </div>
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