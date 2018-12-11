const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://josh@localhost:5432/booking_system_development');

// Models
const evnt = require('./../../db/models/event');
const Events = evnt(sequelize, Sequelize)

const eventRouter = function (app) {

  app.get('/api/events', (req, res) => {
    Events.findAll().then(evt => res.json(evt));
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
