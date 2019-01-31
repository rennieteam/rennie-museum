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
      members: [{email_address: req.body.email, status: "subscribed"}]
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
    
            mailerHelper(result.dataValues, req.body.subscribe);
    
            // if(req.body.subscribe){
            //   const mailChimp = new Mailchimp(config.mailchimp.key);
            //   mailChimp.post(`lists/${config.mailchimp.listId}`, {
            //     members: [{email_address: req.body.email, status: "subscribed"}]
            //   })
            //   .then((result) => {
            //     console.log(result);
            //   })
            //   .catch((error) => {
            //     console.log(result);
            //   })
            // };
          
            // transport.sendMail({
            //   from: config.mandrill.fromAddress,
            //   to: req.body.email,
            //   subject: config.mandrill.subject,
            //   html: `Thank you for booking! <a href="${config.cancelLink}${hash}">Edit/Cancel Booking</a>`
            // }, function(error, info){
            //   if(error){
            //     console.log(error);
            //   } else {
            //     console.log(info);
            //   }
            // });
    
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
      mailerHelper(updatedAttendee.dataValues);
      res.send(200);
    })
    .catch((error) => {
      console.log(error)
    })
  });

  app.options('/api/attendee/:attendeeId', cors(corsOptions));

  app.delete('/api/attendee/:attendeeId', cors(corsOptions), (req, res) => {
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
