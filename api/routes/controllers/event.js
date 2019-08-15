const db = require('./../../db/models/index');
const Events = db.Event;
const Attendee = db.Attendee;
const Designations = db.Designation;
const AttendeeDesignation = db.AttendeeDesignation;
const cors = require('cors');
const mailerHelper = require('../../helpers/mailerHelper');
const hdate = require('human-date');
const countHelper = require('../../helpers/countHelper');
const moment = require('moment-timezone');

const config = require('../../config');

const corsOptions = {
  origin: (origin, callback) => {
    if(config.allowedOrigin.indexOf(origin) !== -1 || !origin){
      callback(null, true);
    } else {
      callback(new Error('Origin forbidden'));
    };
  }
};

const eventRouter = function (app) {

  const splitPayload = async (req, res, update = {}) => {
    let payload = {};
    payload.update = update;
    payload.designations = await Designations.findAll();

    let activeEvents = await Events.findAll({
      order: [ ['date', 'ASC'] ],
      where: { date: {$gt: new Date()} },
      include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
    });

    let pastEvents = await Events.findAll({
      order: [['date', 'ASC']],
      where: { date: {$lte: new Date()} },
      include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
    });

    payload.active = activeEvents;
    payload.archived = pastEvents;

    res.json(payload);
  };

  app.get('/api/events', (req, res) => {
    splitPayload(req, res);
  });

  app.post('/api/sort_events', async (req, res) => {
    let year = req.body.Year !== null ? req.body.Year.value : '';
    let month = req.body.Month !== null ? req.body.Month.label : '';
    let date = req.body.Date !== null ? req.body.Date.value : '';
    let payload = {};
    
    let filterFunction = (event) => {
      let d = moment(event.dataValues.date).tz('America/Los_Angeles');
      return d.format('MMMM D').includes(month + ' ' + date) && d.format('YYYY').includes(year);
    };
  
    let evts = await Events.findAll({
      order: [['date', 'ASC']],
      where: { date: { $gt: new Date() } },
      include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
    });


    payload.active = await evts.filter(filterFunction);
  
    let pastEvents = await Events.findAll({
      order: [['date', 'ASC']],
      where: { date: { $lte: new Date() } },
      include: [{ model: Attendee, as: 'attendees', include: [{ model: Designations }] }]
    });
  
    payload.archived = await pastEvents.filter(filterFunction);
  
    res.json(payload);
  });

  app.get('/api/coming_events', async (req, res) => {
    let payload = {};
    let events = await Events.findAll({
      order: [['date', 'ASC']],
      where: { date: { $gt: new Date() }, published: true },
      include: [{ model: Attendee, as: 'attendees'}]
    });
    let designations = await Designations.findAll();
    payload.events = events;
    payload.designations = designations;

    res.json(payload);
  });

  app.post('/api/events', (req, res) => {
    Events.create(req.body).then((result) => {
      splitPayload(req, res);

    }).catch(error => {
      console.log(error)
    })
  });

  app.put('/api/event/:eventId', async (req, res) => {
    let options = {};
    if(req.body.date){
      options.date = req.body.date;
    };
    
    if(req.body.numberOfAttendees){
      options.numberOfAttendees = req.body.numberOfAttendees;
    };

    options.published = req.body.published;
    
    let { guestsRemoval, guestsAddition, EventId, count, notify, removal } = req.body;
    let removals = await Attendee.findAll({
      where: { id: req.body.removal }
    });

    if(removals.length){
      await AttendeeDesignation.destroy({
        where: { AttendeeId: removal }
      });
  
      await Attendee.destroy({
        where: { id: removal }
      });
  
      if(notify){
        removals.forEach((attendee) => {
          mailerHelper(attendee.dataValues, false, false, true);
        });
      };
    };
  
    if(Object.keys(guestsRemoval).length){
      for(let key in guestsRemoval){
        let result = await Attendee.findOne({ where: { id: parseInt(key) } });
        if(result){
          let g = await result.dataValues.guests.filter((guest, index) => {
            return !guestsRemoval[key][index]
          });
          await result.update({ guests: g });
        };
      };
    };
  
    if(Object.keys(guestsAddition).length){
      let event = await Events.findOne({
        where: { id: EventId },
        include: [{ model: Attendee, as: 'attendees' }]
      });
  
      let spots = await event.dataValues.numberOfAttendees - countHelper(event.dataValues);
      if(count > spots){
        res.json({ tooMany: true });
      } else {
        for(let key in guestsAddition){
          let attendee = await Attendee.findOne({ where: {id: parseInt(key)}});
          let g = attendee.dataValues.guests;
          guestsAddition[attendee.dataValues.id].forEach((guest) => {
            g.push(guest);
          });
          await attendee.update({ guests: g });
        };
      };
    };
  
    let updateEvent = await Events.findOne({
      where: { id: parseInt(req.params['eventId']) },
      include: [{ model: Attendee, as: 'attendees' }]
    });
  
    if(updateEvent){
      await updateEvent.update(options)
        .then((result) => {
          if(result){
            if(notify){
              updateEvent.dataValues.attendees.forEach((attendee) => {
                mailerHelper(attendee.dataValues, false, false, false, true);
              });
            };
            splitPayload(req, res, result);
          } else {
            res.sendStatus(400);
          };
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        });
    };
  });

  // this line needed to enable CORS pre-flight for delete method
  app.options('/api/event/:eventId', cors(corsOptions));

  app.delete('/api/event/:eventId', cors(corsOptions), async (req, res) => {

    let event = await Events.findOne({
      where: { id: parseInt(req.params['eventId']) },
      include: [{ model: Attendee, as: 'attendees' }]
    });

    let ids = [];

    event.attendees.forEach((attendee) => {
      ids.push(attendee.id);
    });

    AttendeeDesignation.destroy({
      where: { AttendeeId:  ids }
    }).then(() => {
      event.destroy();
    }).then(() => {
      splitPayload(req, res);
    }).catch((error) => {
      console.log(error);
      res.json(error);
    });
  });
}

module.exports = eventRouter;
