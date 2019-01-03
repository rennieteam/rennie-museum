// const express = require('express');

// const epf = require("express-php-fpm").default

// const options = {
//   // root of your php files
//   documentRoot: __dirname + "/php_files",

//   // extra env variables
//   env: {},

//   // connection to your php-fpm server
//   // https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
//   socketOptions: { port: 9000 },
// }

// const app = express();
// app.set('port', process.env.PORT || 8080);

// // must specify options hash even if no options provided!
// const phpExpress = require('php-express')({

//   // assumes php is in your PATH
//   binPath: 'php'
// });

// // set view engine to php-express
// app.set('views', './_wp');
// app.engine('php', phpExpress.engine);
// app.set('view engine', 'php');

// app.get('*', phpExpress.router);

// app.listen(app.get('port'), function () {
//   console.log('PHPExpress app listening at http://localhost:8080');
// });


const express = require("express")
const epf = require("express-php-fpm").default

const options = {
  // root of your php files
  documentRoot: __dirname + "/_wp",

  // extra env variables
  env: {},

  // connection to your php-fpm server
  // https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
  socketOptions: { port: 9000 },
}

const app = express()
app.use("/", epf(options))
app.listen(8080)
