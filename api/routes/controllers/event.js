const db = require('./../../db/models/index');
const Events = db.Event;
const Attendee = db.Attendee;
const cors = require('cors');
const mailerHelper = require('../../helpers/mailerHelper');
const hdate = require('human-date');

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

  const splitPayload = (req, res, update = {}) => {
    let payload = {};
    payload.update = update;
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
          as: 'attendees'
        }]
      }
    )
    .then((evt) => {
      payload.active = evt;
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
            as: 'attendees'
          }]
        }
      ).then((pastEvents) => {
        payload.archived = pastEvents;
      })
      .then(() => {
        res.json(payload);
      })
    })
  };

  app.get('/api/events', (req, res) => {
    splitPayload(req, res);
  });

  app.post('/api/sort_events', (req, res) => {
    console.log(req.body.date);
    console.log('server date', new Date())
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
          as: 'attendees'
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
            as: 'attendees'
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

  app.get('/api/coming_events', (req, res) => {
    Events.findAll(
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
    )
    .then(evt => res.json(evt));
  });

  app.post('/api/events', (req, res) => {
    Events.create(req.body).then((result) => {
      splitPayload(req, res);

    }).catch(error => {
      console.log(error)
    })
  });

  app.get('/api/event/:eventId', (req, res) => {
    Events.findOne({
      where: {
        id: parseInt(req.params['eventId'])
      },
      include: [{
        model: Attendee,
        as: 'attendees'
      }]
    })
    .then(evt => res.json(evt))
    .catch(error => res.send(error))
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
    }).then((results) => {
      if(results.length){
        Attendee.destroy({
          where: {
            id: req.body.removal
          }
        })
      };
    }).then(() => {
      let filter = {
        where: { id: parseInt(req.params['eventId']) },
        include: [
          { model: Attendee, as: 'attendees' }
        ]
      };

      Events.findOne(filter).then((event) => {
        if(event){
          event.update(options).then(result => {
            if(req.body.notify){
              event.dataValues.attendees.forEach((attendee) => {
                mailerHelper(attendee.dataValues, false, false, false, true);
              });
            };
            splitPayload(req, res, result);
          })
          .catch(error => console.log(error));
        } else {
          res.sendStatus(400);
        };
      }).catch(error => res.json(error));
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
