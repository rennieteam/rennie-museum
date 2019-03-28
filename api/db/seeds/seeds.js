//  TODO: Make Seed function to be used during testing and development
const config = require('../../config/config.json')['test'];
const Sequelize = require('sequelize');
const testConfig = require('../../testconfig.js');

const sequelize = new Sequelize(config.database, config.username, config.password, config);
// Mock data
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.times");
const crypto = require('crypto');
const secret = 'abc';

const db = require('../models/index.js');
const Attendee = db.Attendee;
const Event = db.Event;



sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    Event.bulkCreate(
      times(testConfig.eventSeedCount, () => ({
        externalId: faker.random.number(),
        externalSlug: faker.internet.url(),
        date:  (random(1, 10) > 5) ? faker.date.past() : faker.date.future(),
        numberOfAttendees: 15,
      })), {returning: true}
    ).then((result) => {
      Attendee.bulkCreate(
        times(testConfig.attendeeSeedCount, () => {
          let email = faker.internet.email();
          return ({
            name: faker.name.findName(),
            email: email,
            EventId: Math.floor(Math.random() * 10) + 1,
            guests: [],
            hash: crypto.createHmac('sha256', secret).update(`${new Date()}${email}`).digest('hex')
          })
        }), {returning: true}
      ).then(() => {
        Event.create({
          externalId: faker.random.number(),
          externalSlug: faker.internet.url(),
          date: (random(1, 10) > 5) ? faker.date.past() : faker.date.future(),
          numberOfAttendees: 1
        }).then(() => {
          Event.create({
            externalId: faker.random.number(),
            externalSlug: faker.internet.url(),
            date: (random(1, 10) > 5) ? faker.date.past() : faker.date.future(),
            numberOfAttendees: 1
          }).then(() => {
            process.exit();
          })
        });
      });


    });

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
