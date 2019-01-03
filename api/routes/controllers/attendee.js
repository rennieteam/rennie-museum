const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://Paul@localhost:5432/booking_system_development');

// Models
const db = require('./../../db/models/index');
const Event = db.Event;
const Attendee = db.Attendee;

const attendeeRouter = function (app) {
  app.get('/api/attendees', (req, res) => {
    Attendee.findAll().then(attendee => res.json(attendee));
  });

  app.post('/api/attendees', (req, res) => {
    // Event.update(
    //   { numberOfAttendees: sequelize.literal(`numberOfAttendees + 1 + ${req.body.guests.length}`) },
    //   { where: { id: req.body.EventId } }
    // ).then((result) => {

    // });

    Event.find({ where: { id: req.body.EventId } })

    Attendee.create(req.body)
      .then( (result) => {
        // Event.findOne({
        //   where: {
        //     id: req.body.EventId
        //   }
        // }).then((result) => {
        //   result.numberOfAttendees + req.body.guests.length + 1;
        // });
        res.json(result);
      })
      .catch(error => console.log(error))
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
