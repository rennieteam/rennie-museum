const schedule = require('node-schedule');
const moment = require('moment-timezone');
const db = require('../db/models/index');
const Event = db.Event;
const Attendee = db.Attendee;
const mailerHelper = require('./mailerHelper');

module.exports = async () => {

  const automatedMailer = schedule.scheduleJob('0 0 16 * * *' ,async function(){
    let start = moment().startOf('day');
    let end = moment().endOf('day');
    let startSearch = moment(start).add(2, 'days');
    let endSearch = moment(end).add(2, 'days');
  
    let events = await Event.findAll({
      where: {
        date: { $gte: startSearch, $lte: endSearch },
        published: true
      },
      include: [{ model: Attendee, as: 'attendees' }]
    });
  
    if(events.length){
      events.forEach((event) => {
        event.attendees.forEach((attendee) => {
          attendee.eventDate = moment(event.date).tz('America/Los_Angeles').format('MMMM Do YYYY [at] hh:mm a');
          mailerHelper(attendee, false, false, false, false, true);
        })
      })
    };
  });


};