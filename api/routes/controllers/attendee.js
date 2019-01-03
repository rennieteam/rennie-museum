const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://Paul@localhost:5432/booking_system_development');

// Models
const att = require('./../../db/models/attendee');
const Attendee = att(sequelize, Sequelize)

const attendeeRouter = function (app) {
  app.get('/api/attendees', (req, res) => {
    Attendee.findAll().then(attendee => res.json(attendee));
  });

  app.post('/api/attendees', (req, res) => {
    Attendee.create(req.body).then( (result) => {
      res.json(result);
    });
  });

  app.get('/api/attendee/:attendeeId', (req, res) => {
    Attendee.findAll({
      where: {
        id: parseInt(req.params['attendeeId'])
      }
    }).then(attendee => res.json(attendee));
  });

  app.put('/api/attendee/:attendeeId', (req, res) => {
    Attendee.update(req.query, {
      where: {
        id: parseInt(req.params['attendeeId'])
      }
    }).then( (result) => {
      res.json(result);
    });
  });

  app.delete('/api/attendee/:attendeeId', (req, res) => {
    Attendee.destroy({
      where: {
        id: parseInt(req.params['attendeeId'])
      }
    }).then( (result) => {
      res.json(result);
    });
  });
}

module.exports = attendeeRouter;
