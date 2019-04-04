const db = require('./../../db/models/index');
const Event = db.Event;
const Attendee = db.Attendee;
const AttendeeDesignation = db.AttendeeDesignation;
const Designations = db.Designation;
const nodemailer = require("nodemailer");
const mandrillTransport = require('nodemailer-mandrill-transport');
const config = require('../../config');
const Mailchimp = require('mailchimp-api-v3');
const crypto = require('crypto');
const secret = 'abc';
const cors = require('cors');
const mailerHelper = require('../../helpers/mailerHelper');
const countHelper = require('../../helpers/countHelper');
const hdate = require('human-date');
const moment = require('moment-timezone');

const corsOptions = {
  origin: (origin, callback) => {
    if (config.allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin forbidden'));
    };
  }
};

let transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: config.mandrill.key
  }
}));

const attendeeRouter = function (app) {
  app.get('/api/attendees', (req, res) => {
    Attendee.findAll().then((attendees) => {
      res.json(attendees);
    })
  });

  app.post('/api/attendee/register', (req, res) => {
    const mailChimp = new Mailchimp(config.mailchimp.key);
    mailChimp.post(`lists/${config.mailchimp.listId}`, {
      members: [{
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.firstName,
          LNAME: req.body.lastName
        }
      }]
    })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.sendStatus(error.response.status);
    })
  });
  
  app.post('/api/attendees', async (req, res) => {
    let date = new Date();
    let hash = crypto.createHmac('sha256', secret).update(`${date}${req.body.email}`).digest('hex');
    let options = req.body;
    let payload = {};
    options.hash = hash;
    options.DesignationId = req.body.designation.value;

    let existingAttendee = await Attendee.findOne({
      where: {
        email: options.email,
        EventId: options.EventId
      }
    });

    let event = await Event.findOne({
      where: {
        id: req.body.EventId
      },
      include: [{ model: Attendee, as : 'attendees' }]
    });

    let events = await Event.findAll({
      order: [['date', 'ASC']],
      where: {
        date: { $gt: new Date() },
        published: true
      },
      include: [{ model: Attendee, as: 'attendees' }]
    });

    if(existingAttendee){
      payload.success = false;
      payload.emailUsed = true;
      res.json(payload);
    } else if(!event.dataValues.published && !options.adminAdded){
      payload.success = false;
      payload.publishError = true;
      res.json(payload);
    } else if(!req.body.overrideCount && parseInt(countHelper(event.dataValues)) === event.dataValues.numberOfAttendees){
      payload.events = events;
      payload.full = true;
      payload.success = false;
      res.json(payload);
    } else if(!req.body.overrideCount && req.body.guests.length + 1 > event.dataValues.numberOfAttendees - countHelper(event.dataValues)){
      payload.events = events;
      payload.tooMany = true;
      payload.success = false;
      res.json(payload);
    } else {
      Attendee.create(options)
        .then( async (result) => {
          let defaultEvents;
          let activeEvents;
          let pastEvents;

          AttendeeDesignation.create({
            DesignationId: req.body.designation.value,
            AttendeeId: result.dataValues.id
          });

          payload.success = true;
          result.dataValues.eventDate = req.body.eventDate;

          if(req.body.adminAdded){
            if(req.body.notifyAttendee){
              mailerHelper(result.dataValues, false);
            };

            activeEvents = await Event.findAll({
              order: [['date', 'ASC']],
              where: { date: { $gt: new Date() } },
              include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
            });

            pastEvents = await Event.findAll({
              order: [['date', 'ASC']],
              where: { date: { $lte: new Date() } },
              include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
            });

            payload.active = activeEvents;
            payload.archived = pastEvents;    

          } else {
            if(process.env.NODE_ENV !== 'test'){
              mailerHelper(result.dataValues, req.body.subscribe);
            };

            defaultEvents = await Event.findAll({
              order: [['date', 'ASC']],
              where: { date: { $gt: new Date() }, published: true },
              include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
            });

            payload.events = defaultEvents;
          };

          res.json(payload);
        })
        .catch((error) => {
          res.json(error);
        });
    };

  });

  app.get('/api/attendee/:attendeeHash', (req, res) => {
    Attendee.findOne({
      where: {
        hash: req.params['attendeeHash']
      },
      include: [{
        model: Event,
        as: 'event'
      }]
    })
    .then(attendee => {
      if(attendee){
        res.json(attendee);
      } else {
        res.sendStatus(404);
      };
    })
    .catch((error) => {
      console.log(error);
    })
  });

  app.get('/api/attendee/:attendeeId', (req, res) => {
    Attendee.findAll({
      where: {
        id: parseInt(req.params['attendeeId'])
      }
    }).then(attendee => res.json(attendee));
  });

  app.put('/api/attendee/:attendeeId', (req, res) => {
    let options = {};
    options.guests = req.body.guests;
    options.EventId = req.body.EventId;
    let count = req.body.guests.length + 1;
    let evtCount;
    let numberOfAttendees;
    let evtDate;
    let payload = { success: false };

    Event.findOne({
      where: { id: parseInt(req.body.EventId) },
      include: [{
        model: Attendee,
        as: 'attendees'
      }]
    })
    .then((result) => {
      evtDate = result.dataValues.date;
      evtCount = countHelper(result.dataValues);
      numberOfAttendees = result.dataValues.numberOfAttendees;
    })
    .then(() => {
      if(evtCount >= numberOfAttendees){
        payload.full = true;
      } else if(numberOfAttendees - evtCount < count){
        payload.tooMany = true;
      } else if(new Date(evtDate) < new Date()) {
        payload.past = true;
      } else {
        payload.success = true;
      };
    })
    .then(() => {
      if(payload.success){
        Attendee.update(
          options,
          { returning: true, where: {id: req.params['attendeeId']} }
        )
        .then(([result, [updatedAttendee]]) => {
          updatedAttendee.dataValues.eventDate = req.body.eventDate;
          if(process.env.NODE_ENV !== 'test'){
            mailerHelper(updatedAttendee.dataValues, false, false, false, true);
          };
          payload.updatedAttendee = updatedAttendee;
          res.json(payload);
        })
        .catch((error) => {
          res.json(error);
        })
      } else {
        res.json(payload);
      };
    })
    .catch(error => {
      res.json(error);
    })

  });

  app.options('/api/attendee/:attendeeId', cors(corsOptions));

  app.delete('/api/attendee/:attendeeId', cors(corsOptions), (req, res) => {
    Attendee.findOne({
      where: { id: parseInt(req.params['attendeeId'])},
      include: [{
        model: Event,
        as: 'event'
      }]
    }).then( async (result) => {
      let options = {};
      options.email = result.email;
      options.name = result.name;
      options.guests = result.guests;
      options.eventDate = moment(result.event.date).tz('America/Los_Angeles').format('MMMM Do, YYYY - h:mm a');
      mailerHelper(options, false, true, false, false);
      let d = await AttendeeDesignation.findOne({
        where: {
          AttendeeId: parseInt(req.params['attendeeId'])
        }
      });
      if(d){
        d.destroy().then(() => { result.destroy() });
      } else {
        result.destroy();
      };
      res.json(result);
    }).catch(error => {
      console.log(error);
      res.json(error);
    });
  });
}

module.exports = attendeeRouter;
