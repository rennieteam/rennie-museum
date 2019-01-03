console.log('✅\tStarting set-up process');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// installHomeBrew()
//   .then(result => {
//     console.log(result);
//     console.log('Install mysql');
//     console.log('Install php');
//     console.log('Install wp-cli');
//   });



/*

Install mysql
https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e

Install php

Installing wp-cli
brew install wp-cli

mkdir wp
cd wp
mysqladmin -uroot -p create testing_db
wp core download
wp config create --dbname=testing_db --dbuser=root --prompt=dbpass
wp core install --url=localhost --title="Rennie Musuem" --admin_user=admin --admin_email=jlaidlaw@rennie.com


*/


install('brew', '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"', 'Homebrew')
.then(result => {
  if(result.status != null) {
    install('mysql', '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"', 'mysql').then(result => {
      if(result.status != null) {
        console.log(result.message);
      }
    });
  }
  console.log(result.message);
});

function install(name, cmd, prettyName){
  return new Promise(resolve => {
    exec(`which ${name}`, (err, stdout, stderr) => {
      if (stdout == '') {
        console.log(`🚚 \t${prettyName} Homebrew...`);
        exec(`${cmd}`, (err, stdout, stderr) => {
          if(err) {
            resolve({status: 1, message: `⛔️\tError installing ${prettyName}`, err: err});
          } else {
            resolve({status: null, message: `✅ \t${prettyName} installed.`, err: null});
          }
        });
      } else {
        resolve({status: null, message: `✅ \t${prettyName} installed.`, err: null});
      }
    });
  });
}
