const schedule = require('node-schedule');
const moment = require('moment-timezone');
const db = require('../db/models/index');
const Event = db.Event;

module.exports = async () => {
  const automatedMailer = schedule.scheduleJob('10 * * * * *', function(){
    console.log(new Date())
  })
};