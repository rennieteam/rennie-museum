const schedule = require('node-schedule-tz');
const moment = require('moment-timezone');
const db = require('../db/models/index');
const Event = db.Event;
const Attendee = db.Attendee;
const mailerHelper = require('./mailerHelper');

module.exports = async () => {
  const automatedMailer = schedule.scheduleJob('0 0 8 * * *', 'America/Los_Angeles' ,async function(){
    let start = moment().startOf('day');
    let end = moment().endOf('day');
    let startSearch = moment(start).add(2, 'days');
    let endSearch = moment(end).add(2, 'days');
  
    let events = await Event.findAll({
      where: {
        date: { $gte: startSearch, $lte: endSearch }
      },
      include: [{ model: Attendee, as: 'attendees' }]
    });
  
    let filteredEvents = await events.filter((event) => {
      return event.published;
    });
  
    if(filteredEvents.length){
      filteredEvents.forEach((event) => {
        event.attendees.forEach((attendee) => {
          mailerHelper(attendee, false, false, false, false, true);
        })
      })
    };

  });

};