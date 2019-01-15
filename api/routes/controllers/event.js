const db = require('./../../db/models/index');
const Events = db.Event;
const Attendee = db.Attendee;
const cors = require('cors');

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

  app.get('/api/events', (req, res) => {
    Events.findAll(
      {
        order: [
          ['date', 'ASC']
        ]
      }
    )
    .then(evt => res.json(evt));
  });

  app.post('/api/events', (req, res) => {
    Events.create(req.body).then((result) => {
      res.json(result);
    });
    res.json({})
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
    if(req.body.newDate){
      options.date = req.body.newDate;
    };

    if(req.body.attendeesRemoval.length){
      Attendee.destroy({
        where: {
          id: req.body.attendeesRemoval
        }
      });
    };

    Events.update(
      options,
      {returning: true, where: { id: req.body.event.id }}
    )
    .then(([result, [updatedEvent]]) => {
      res.json(updatedEvent);
    })
    .catch((error) => {
      res.json(error);
    })
  });

  // this line needed to enable CORS pre-flight for delete method
  app.options('/api/event/:eventId', cors(corsOptions));

  app.delete('/api/event/:eventId', cors(corsOptions), (req, res) => {
    Events.destroy({
      where: {
        id: parseInt(req.params['eventId'])
      }
    }).then((result) => {
      res.json(result);
    });
  });
}

module.exports = eventRouter;
