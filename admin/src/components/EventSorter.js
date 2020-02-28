import React, { Component } from 'react';
import axios from 'axios';
import config from './../config';
import Select from 'react-select';
import moment from 'moment-timezone';

const publishOptions = [
  {value: 'all', label: 'All'},
  {value: 'published', label: 'Published'},
  {value: 'draft', label: 'Draft'}
];

class EventSorter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: 'asc',
      dateSort: true,
      capSort: false,
      selectedYear: null,
      selectedMonth: null,
      selectedDate: null,
      yearOptions: [],
      monthOptions: [],
      dateOptions: [],
      attendeeSearch: ''
    };
  };

  componentDidMount = () => {
    this.handleFilter();
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.events !== prevProps.events){
      let yearBuffer = {};
      let yearOptions = [];
      let monthBuffer = {};
      let monthOptions = [];
      let dateBuffer = {};
      let dateOptions = [];
      this.props.events.forEach((event) => {
        let date = moment(event.date).tz('America/Los_Angeles');
        let year = date.format('YYYY');
        let month = date.format('MMMM');
        let monthVal = date.format('M') - 1;
        let day = date.format('D');
        if(yearBuffer[year] === undefined){
          yearOptions.push({ value: year, label: year, for: 'Year' });
          yearBuffer[year] = true;
        };
        if(monthBuffer[month] === undefined){
          monthOptions.push({ value: monthVal, label: month, for: 'Month' });
          monthBuffer[month] = true;
        };
        if(dateBuffer[day] === undefined){
          dateOptions.push({ value: day, label: day, for: 'Date' });
          dateBuffer[day] = true;
        };
      });
      function compare(a, b){
        return a.value - b.value;
      };
      yearOptions.sort(compare);
      monthOptions.sort(compare);
      dateOptions.sort(compare);
      this.setState({ yearOptions, dateOptions, monthOptions });
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
      events = this.props.events.sort((a,b) => {
        return sortHelper(a, b);
      });
      newState.sort = 'asc';
      this.props.sortEvents(events);
    } else {
      events = this.props.events.sort((a,b) => {
        return orderHelper(a,b);
      });
      newState.sort = this.state.sort === 'asc' ? 'desc' : 'asc';
      this.props.sortEvents(events);
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

  filterEvents = (payload) => {
    let url;
    if(process.env.REACT_APP_ENV){
      url = config[process.env.REACT_APP_ENV];
    } else {
      url = config.development;
    };
    axios.post(`${url}/api/sort_events/`, payload)
      .then((result) => {
        this.props.updateEvents(result.data);
      })
      .catch((error) => {
      })
  };

  handleFilter = (selection = null) => {
    let payload = {};
    payload.attendeeSearch = this.state.attendeeSearch;
    payload.active = this.props.toggleActive;
    payload.Month = this.state.selectedMonth ? this.state.selectedMonth : null;
    payload.Year = this.state.selectedYear ? this.state.selectedYear : null;
    payload.Date = this.state.selectedDate ? this.state.selectedDate : null;
    if(selection){
      payload[selection.for] = selection;
      let state = {};
      state[`selected${selection.for}`] = selection;
      this.setState(state);
    };
    this.filterEvents(payload);
  };

  clearFilters = () => {
    this.props.sortPublished(null);
    this.setState({ attendeeSearch: '', selectedYear: null, selectedMonth: null, selectedDate: null, sort: 'asc', dateSort: true, capSort: false });
    let url;
    if(process.env.REACT_APP_ENV){
      url = config[process.env.REACT_APP_ENV];
    } else {
      url = config.development;
    };
    axios.get(`${url}/api/events/`)
      .then((result) => {
        this.props.updateEvents(result.data);
      })
      .catch((error) => {

      })
  };

  handlePublish = (selection) => {
    this.props.sortPublished(selection);
  };

  handleAttendeeSearch = async (event) => {
    const newState = Object.assign({}, this.state);
    newState[event.target.name] = event.target.value;
    await this.setState(newState);
    this.handleFilter();
    this.props.setAttendeeSearch(this.state.attendeeSearch)
  };

  render = () => {
    return(
      <div className="sorter-container">
        <div className="sorter-item-container">
          <span className="sort-label"> Sort by: </span>
          <div className="sort-item" onClick={() => this.sortEvents('dateSort')}>
            <span className="sort-item-label"> Date </span>
            {this.renderSortArrow('dateSort')}
          </div>
          <div className="sort-item" onClick={() => this.sortEvents('capSort')}>
            <span className="sort-item-label"> Capacity </span>
            {this.renderSortArrow('capSort')}
          </div>
          <div className="active-archive-switch-container" onClick={this.props.activeSwitch}>
            <div className={this.props.toggleActive ? 'active indicator' : 'archive indicator'}></div>
            <span className="label"> 
              { this.props.toggleActive ? 'Active' : 'Archived' }
            </span>
          </div>
        </div>
        <div className="date-filter-container">
          <Select
            className="date-filter"
            placeholder="Year"
            value={this.state.selectedYear}
            options={this.state.yearOptions}
            onChange={this.handleFilter}
          />
          <Select
            className="date-filter"
            placeholder="Month"
            value={this.state.selectedMonth}
            options={this.state.monthOptions}
            onChange={this.handleFilter}
          />
          <Select
            className="date-filter"
            placeholder="Date"
            value={this.state.selectedDate}
            options={this.state.dateOptions}
            onChange={this.handleFilter}
          />
          <Select
            placeholder="All"
            value={this.props.published}
            options={publishOptions}
            onChange={this.handlePublish} 
            className="publish-filter"
          />
          <input
            className='attendee-search'
            placeholder='Search Primary Attendees'
            value={this.state.attendeeSearch}
            onChange={this.handleAttendeeSearch}
            name='attendeeSearch'
          />
          <button className="clear-button" onClick={this.clearFilters}> Clear </button>
        </div>
      </div>
    )
  };

}

export default EventSorter;
