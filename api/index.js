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

const server = http.createServer(app);
app.set('port', port);
server.listen(port);

attendeeRouter(app);
eventRouter(app);

app.get('*', (req, res) => res.status(200).send());
