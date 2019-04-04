const db = require('./../../db/models/index');
const Events = db.Event;
const Attendee = db.Attendee;
const Designations = db.Designation;
const AttendeeDesignation = db.AttendeeDesignation;
const cors = require('cors');
const mailerHelper = require('../../helpers/mailerHelper');
const hdate = require('human-date');
const countHelper = require('../../helpers/countHelper');

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
    let designations = await Designations.findAll();
    payload.designations = designations;


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

  app.post('/api/sort_events', (req, res) => {
    let year = req.body.Year !== null ? req.body.Year.value : '';
    let month = req.body.Month !== null ? req.body.Month.label : '';
    let date = req.body.Date !== null ? req.body.Date.value : '';
    let payload = {};
    Events.findAll(
      {
        order: [
          ['date', 'ASC']
        ],
        where: {
          date: {
            $gt: new Date()
          }
        },
        include: [{
          model: Attendee,
          as: 'attendees',
          include: [{ model: Designations }]
        }]
      }
    )
    .then((evts) => {
      let activeEvents = evts.filter((event) => {
        if(process.env.NODE_ENV === 'production'){
          let utcDate = new Date(Date.parse(event.dataValues.date));
          let utcDateString = new Date(utcDate.toUTCString());
          // temporary use value of 7, need ot fix
          utcDateString.setHours(utcDateString.getHours() - 7);
          let pstDate = new Date(utcDateString);
          let pstd = hdate.prettyPrint(new Date(pstDate));
          return pstd.includes(month + ' ' + date) && pstd.includes(year);
        } else {
          let d = hdate.prettyPrint(new Date(Date.parse(event.dataValues.date)));
          return d.includes(month + ' ' + date) && d.includes(year);
        };
      });
      payload.active = activeEvents;
    }).then(() => {
      Events.findAll(
        {
          order: [
            ['date', 'ASC']
          ],
          where: {
            date: {
              $lte: new Date()
            }
          },
          include: [{
            model: Attendee,
            as: 'attendees',
            include: [{ model: Designations }]
          }]
        }
      ).then((pastEvents) => {
        let archivedEvents = pastEvents.filter((event) => {
          let d = hdate.prettyPrint(new Date(Date.parse(event.dataValues.date)));
          return d.includes(month + ' ' + date) && d.includes(year);
        });
        payload.archived = archivedEvents;
      })
      .then(() => {
        res.json(payload);
      })
    })
  });

  app.get('/api/coming_events', async (req, res) => {
    let payload = {};
    let events = await Events.findAll(
      {
        order: [
          ['date', 'ASC']
        ],
        where: {
          date: {
            $gt: new Date()
          },
          published: true
        },
        include: [{
          model: Attendee,
          as: 'attendees'
        }]
      }
    );
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

  app.put('/api/event/:eventId', (req, res) => {
    let options = {};
    if(req.body.date){
      options.date = req.body.date;
    };

    options.published = req.body.published;

    if(req.body.numberOfAttendees){
      options.numberOfAttendees = req.body.numberOfAttendees
    };

    let { guestsRemoval, guestsAddition, EventId, count} = req.body;

    Attendee.findAll({
      where: {
        id: req.body.removal
      }
    }).then((results) => {
      if(req.body.notify && results.length){
        results.forEach((attendee) => {
          let a = attendee.dataValues;
          mailerHelper(a, false, false, true);
        });
      };
      return results;
    }).then(async (results) => {
      if(results.length){
        let d = await AttendeeDesignation.destroy({
          where: {
            AttendeeId: req.body.removal
          }
        });

        let a = await Attendee.destroy({
          where: {
            id: req.body.removal
          }
        });
      };
    }).then(async () => {
      if(Object.keys(guestsRemoval).length){
        for(let key in guestsRemoval){
          let result = await Attendee.findOne({
            where: {
              id: parseInt(key)
            }
          });
          if(result){
            let g = await result.dataValues.guests.filter((guest, index) => {
              return !guestsRemoval[key][index]
            });
            await result.update({
              guests: g
            })
          };
        };
      };
    }).then(async () => {
      if(Object.keys(guestsAddition).length){
        let event = await Events.findOne({
          where: { id: EventId },
          include: [
            { model: Attendee, as: 'attendees' }
          ]
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
            await attendee.update({
              guests: g
            })
          };
        }
      };
    }).then(async () => {
      let filter = {
        where: { id: parseInt(req.params['eventId']) },
        include: [
          { model: Attendee, as: 'attendees' }
        ]
      };

      let event = await Events.findOne(filter);
      if(event){
        await event.update(options).then((result) => {
          if(req.body.notify){
            event.dataValues.attendees.forEach((attendee) => {
              mailerHelper(attendee.dataValues, false, false, false, true);
            });
          };
          splitPayload(req, res, result);
        })
      } else {
        res.sendStatus(400);
      };
    })
    .catch(error => {
      console.log(error);
    });

  });

  // this line needed to enable CORS pre-flight for delete method
  app.options('/api/event/:eventId', cors(corsOptions));

  app.delete('/api/event/:eventId', cors(corsOptions), (req, res) => {

    Events.destroy({
      where: {
        id: parseInt(req.params['eventId'])
      }
    }).then((result) => {
      splitPayload(req, res);
    }).catch(err => console.log(err))
  });
}

module.exports = eventRouter;
