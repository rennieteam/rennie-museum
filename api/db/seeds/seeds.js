//  TODO: Make Seed function to be used during testing and development

// Mock data
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.times");



// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');

//     // Attendee.bulkCreate(
//     //   times(10, () => ({
//     //     name: faker.name.findName(),
//     //     email: faker.internet.email(),
//     //     event_id: faker.random.number(),
//     //   }))
//     // );

//     // Event.bulkCreate(
//     //   times(10, () => ({
//     //     externalId: faker.random.number(),
//     //     externalSlug: faker.internet.url(),
//     //     date:  (random(1, 10) > 5) ? faker.date.past() : faker.date.future(),
//     //     numberOfAttendees: faker.random.number(),
//     //   }))
//     // );

//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
