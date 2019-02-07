const db = require('./../../db/models/index');
const Event = db.Event;
const Attendee = db.Attendee;
const nodemailer = require("nodemailer");
const mandrillTransport = require('nodemailer-mandrill-transport');
const config = require('../../config');
const Mailchimp = require('mailchimp-api-v3');
const crypto = require('crypto');
const secret = 'abc';
const cors = require('cors');
const mailerHelper = require('../../helpers/mailerHelper');
const hdate = require('human-date');

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
  
  app.post('/api/attendees', (req, res) => {
    let date = new Date();
    let hash = crypto.createHmac('sha256', secret).update(`${date}${req.body.email}`).digest('hex');
    let options = req.body;
    options.hash = hash;

    Attendee.findOne({
      where: {
        email: options.email,
        EventId: options.EventId
      }
    })
    .then((result) => {
      if(result){
        res.sendStatus(403);
      } else {
        Attendee.create(options)
          .then((result) => {
            result.dataValues.eventDate = req.body.eventDate;
            mailerHelper(result.dataValues, req.body.subscribe);
    
            res.json(result);
          })
          .catch(error => res.send(error))
      }
    })
    .catch((error) => {
      res.send(error);
    })

  });

  app.get('/api/attendee/:attendeeHash', (req, res) => {
    Attendee.findOne({
      where: {
        hash: req.params['attendeeHash']
      },
      include: [{
        model: Event,
      }]
    }).then(attendee => res.json(attendee))
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

    Attendee.update(
      options,
      { returning: true, where: {id: req.params['attendeeId']} }
    )
    .then(([result, [updatedAttendee]]) => {
      updatedAttendee.dataValues.eventDate = req.body.eventDate;
      mailerHelper(updatedAttendee.dataValues, false, false, false, true);
      res.send(200);
    })
    .catch((error) => {
      console.log(error)
    })
  });

  app.options('/api/attendee/:attendeeId', cors(corsOptions));

  app.delete('/api/attendee/:attendeeId', cors(corsOptions), (req, res) => {
    Attendee.findOne({
      where: { id: parseInt(req.params['attendeeId'])},
      include: [{
        model: Event
      }]
    }).then((result) => {
      let options = {};
      options.email = result.dataValues.email;
      options.name = result.dataValues.name;
      options.guests = result.dataValues.guests;
      options.eventDate = hdate.prettyPrint(new Date(Date.parse(result.dataValues.Event.dataValues.date)), {showTime: true});
      mailerHelper(options, false, true, false, false);
      result.destroy();
      res.json(result);
    }).catch(error => {
      res.json(error);
    });
  });
}

module.exports = attendeeRouter;
