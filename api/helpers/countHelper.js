module.exports = (event = {}) => {
  let eventCount = event.attendees.length;
  if(eventCount >= event.numberOfAttendees){
    return eventCount;
  } else {
    event.attendees.forEach((attendee) => {
      eventCount += attendee.guests.length;
    });
  };
  return eventCount;
};