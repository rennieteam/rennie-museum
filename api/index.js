const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const port = parseInt(process.env.PORT, 10) || 8000;
const app = express();

// Routes
const attendeeRouter = require("./routes/controllers/attendee");
const eventRouter = require("./routes/controllers/event");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // fix these up with origins from a config file or something
  res.header("Access-Control-Allow-Origin", ["http://localhost:3000"]);
  res.header("Access-Control-Allow-Method", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


const server = http.createServer(app);
app.set('port', port);
server.listen(port);

attendeeRouter(app);
eventRouter(app);

app.get('*', (req, res) => res.status(200).send());
