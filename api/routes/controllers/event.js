const db = require('./../../db/models/index');
const Events = db.Event;
const Attendee = db.Attendee;

const eventRouter = function (app) {

  app.get('/api/events', (req, res) => {
    Events.findAll().then(evt => res.json(evt));
  });

  app.get('/api/events/test', (req, res) => {
    Events.findOne({
      where: {
        id: 1
      },
      include: [{
        model: Attendee,
        as: 'attendees'
      }]
    }).then(evt =>
      {console.log(evt);
      res.json(evt);
      }
    )
  });

  app.post('/api/events', (req, res) => {
    Events.create(req.query).then((result) => {
      res.json(result);
    });
  });

  app.get('/api/event/:eventId', (req, res) => {
    Events.findAll({
      where: {
        id: parseInt(req.params['EventId'])
      }
    }).then(evt => res.json(evt));
  });

  app.put('/api/event/:eventId', (req, res) => {
    Events.update(req.query, {
      where: {
        id: parseInt(req.params['EventId'])
      }
    }).then((result) => {
      res.json(result);
    });
  });

  app.delete('/api/event/:eventId', (req, res) => {
    Events.destroy({
      where: {
        id: parseInt(req.params['EventId'])
      }
    }).then((result) => {
      res.json(result);
    });
  });
}

module.exports = eventRouter;
