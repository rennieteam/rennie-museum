const db = require('./../../db/models/index');
const Events = db.Event;
const Attendee = db.Attendee;
const cors = require('cors');
const mailerHelper = require('../../helpers/mailerHelper');

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
        ],
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
      Events.findAll(
        {
          order: [
            ['date', 'ASC']
          ],
          include: [{
            model: Attendee,
            as: 'attendees'
          }]
        }
      ).then(result => {
        res.json(result)
      })

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
            res.json(result);
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
    // Attendee.findAll({
    //   where: {
    //     EventId: parseInt(req.params['eventId'])
    //   }
    // }).then((result) => {
    //   result.forEach((attendee) => {
    //     mailerHelper(attendee.dataValues, false, true)
    //   })
    // }).catch(err => console.log(err));

    Events.destroy({
      where: {
        id: parseInt(req.params['eventId'])
      }
    }).then((result) => {
      Events.findAll(
        {
          order: [
            ['date', 'ASC']
          ],
          include: [{
            model: Attendee,
            as: 'attendees'
          }]
        }
      ).then((results) => {
        res.json(result);
      })
    }).catch(err => console.log(err))
  });
}

module.exports = eventRouter;
