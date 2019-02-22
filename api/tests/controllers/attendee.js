process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');
const app = require('../../index.js');
const db = require('./../../db/models/index');
const Attendee = db.Attendee;
const Event = db.Event;
const testConfig = require('../../testconfig.js');

describe('GET /api/attendees', function(){
  it('responds with json', function(done){
    request(app)
      .get('/api/attendees')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      });
  });
});

describe('POST /api/attendees', function(){
  Attendee.create({EventId: 1, name: 'Chester', email: 'chester@rennie.com', guests: []}).then(() => {
    Attendee.create({EventId: testConfig.eventSeedCount + 1, name: 'Chester', email: 'chester@rennie.com', guests: []}).then(() => {
    });
  });
  it('returns error payload on existing email', function(done){
    request(app)
      .post('/api/attendees')
      .send({EventId: 1, email: 'chester@rennie.com'})
      .expect({success: false, emailUsed: true})
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if(err) return done(err);
        done();
      });
  });

  it('returns error payload on full event', function(done){
    Event.findAll(
      {
        order: [
          ['date', 'ASC']
        ],
        include: [{
          model: Attendee,
          as: 'attendees'
        }]
      }
    ).then(results => {
      request(app)
        .post('/api/attendees')
        .send({EventId: testConfig.eventSeedCount + 1, email: 'test@rennie.com'})
        .expect({full: true, success: false, events: JSON.parse(JSON.stringify(results))})
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if(err) return done(err);
          done();
        });
    });
  });

  it('returns error payload on too many guests', function(done){
    Event.findAll(
      {
        order: [
          ['date', 'ASC']
        ],
        include: [{
          model: Attendee,
          as: 'attendees'
        }]
      }
    ).then(results => {
      request(app)
        .post('/api/attendees')
        .send({EventId: testConfig.eventSeedCount + 2, email: 'test@rennie.com', guests: [{name: 'John', email: null}]})
        .expect({tooMany: true, success: false, events: JSON.parse(JSON.stringify(results))})
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if(err) return done(err);
          done();
        });
    });
  });

  it('returns success payload on success', function(done){
    request(app)
      .post('/api/attendees')
      .send({EventId: 1, name: 'tester', email: 'fkajsdlkf@rennie.com', guests: []})
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if(err) return done(err);
        res.body.events.length.should.be.above(0);
        res.body.success.should.equal(true);
        done();
      })
  });

  it('responds with json on success', function(done){
    request(app)
      .post('/api/attendees')
      .send({EventId: 2, name: 'tester', email: 'fkajsdlkf@rennie.com', guests: []})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      });
  });

});

describe('GET /api/attendee/:attendeeHash', function(){
  Attendee.create({EventId: 2, name: 'hashtest', email: 'hashtest@rennie.com', guests: [], hash: 'hashtest'}).then()
  it('responds with 404 if no attendee found', function(done){
    request(app)
      .get('/api/attendee/111fake111')
      .expect(404)
      .end(function(err, res){
        if(err) return done(err);
        done();
      });
  });

  it('responds with json and attendee info on success', function(done){
    request(app)
      .get('/api/attendee/hashtest')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if(err) return done(err);
        res.body.name.should.equal('hashtest');
        res.body.Event.id.should.equal(2);
        done();
      });
  });

});

describe('PUT /api/attendee/:attendeeId', function(){
  it('updates proper fields', function(done){
    let g = [{name: 'update'}];
    request(app)
      .put('/api/attendee/1')
      .send({ EventId: 3, guests: g })
      .end(function(err, res){
        if(err) return done(err);
        res.body.EventId.should.equal(3);
        res.body.guests[0].name.should.equal('update');
        done();
      })
  })
});