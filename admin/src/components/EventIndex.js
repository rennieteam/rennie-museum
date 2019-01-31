import React, { Component } from 'react';
// import axios from 'axios';
// import config from './../config';
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

  sortEvents = (sortBy) => {
    let events;
    let newState = {};
    if(sortBy === 'dateSort'){
      newState.dateSort = true;
      newState.capSort = false;
    } else if(sortBy === 'capSort'){
      newState.capSort = true;
      newState.dateSort = false;
    };

    const sortHelper = (a,b) => {
      if(sortBy === 'dateSort'){
        return new Date(a.date) - new Date(b.date);
      } else if(sortBy === 'capSort'){
        return this.props.calculateCount(a) - this.props.calculateCount(b);
      };
    };

    const orderHelper = (a,b) => {
      if(this.state.sort === 'desc'){
        return sortHelper(a,b);
      } else {
        return sortHelper(b,a);
      };
    };

    if(!this.state[sortBy]){
      events = this.state.events.sort((a,b) => {
        return sortHelper(a, b);
      });
      newState.sort = 'asc';
      newState.events = events;
    } else {
      events = this.state.events.sort((a,b) => {
        return orderHelper(a,b);
      });
      newState.sort = this.state.sort === 'asc' ? 'desc' : 'asc';
      newState.events = events;
    };

    this.setState( newState );
  };

  renderSortArrow = (sortBy) => {
    if(this.state[sortBy]){
      let className = this.state.sort === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      return(
        <i className={className} />
      )
    };
  };

  renderSorter = () => {
    return(
      <div className="sorter-container">
        <span className="sort-label"> Sort by: </span>
        <div className="sort-item" onClick={() => this.sortEvents('dateSort')}>
          <span className="sort-item-label"> Date </span>
          {this.renderSortArrow('dateSort')}
        </div>
        <div className="sort-item" onClick={() => this.sortEvents('capSort')}>
          <span className="sort-item-label"> Capacity </span>
          {this.renderSortArrow('capSort')}
        </div>
      </div>
    )
  };

  render() {
    return (
      <div className="events-index-container">
        { this.renderSorter() }
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