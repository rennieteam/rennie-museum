module.exports = (event = {}) => {
  let attendees;
  if(event.attendees){
    attendees = event.attendees.filter((event) => {
      return !event.overrideCount;
    });
  };
  let eventCount = event.attendees && attendees.length;
  if(eventCount >= event.numberOfAttendees){
    return eventCount;
  } else {
    attendees.forEach((attendee) => {
      eventCount += attendee.guests.length;
    });
  };
  return eventCount;
};