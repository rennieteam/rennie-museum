const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const port = parseInt(process.env.PORT, 10) || 8000;
const app = express();
const fs = require('fs');
const path = require('path');

const config = require('./config');

const emailScheduler = require('./helpers/emailScheduler');

const attendeeRouter = require("./routes/controllers/attendee");
const eventRouter = require("./routes/controllers/event");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  let origin = req.headers.origin;
  if(config.allowedOrigin.includes(origin)){
    res.setHeader("Access-Control-Allow-Origin", origin);
  };
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Method", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const options = {
  key: fs.readFileSync(path.join(__dirname, 'certificates/ssl_key.key')),
  cert: fs.readFileSync(
    path.join(__dirname, 'certificates/ssl_certificate.cer'),
  ),
  ca: fs.readFileSync(
    path.join(__dirname, 'certificates/ssl_intermediate.cer'),
  ),
};

const server = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? http.createServer(app) : https.createServer(options, app);

app.set('port', port);

server.listen(port);

attendeeRouter(app);
eventRouter(app);

emailScheduler();

app.get('*', (req, res) => res.status(200).send());

module.exports = server;
