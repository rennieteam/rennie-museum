const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');
const Mailchimp = require('mailchimp-api-v3');
const config = require('../config.js');

let transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: config.mandrill.key
  }
}));

module.exports = (data = null, subscribe = false, forCancel = false) => {
  let temp = forCancel ? 'your tour has been cancelled' : 'thank you for booking a tour';
  let link = forCancel ? config.homeLink : config.cancelLink;
  let linkText = forCancel ? 'Rebook' : 'Edit/Cancel Booking'
  transport.sendMail({
    from: config.mandrill.fromAddress,
    to: data.email,
    subject: 'Test',
    html: `<p> Hi ${data.name}, ${temp}. <a href="${link}${data.hash}"> ${linkText} </a> </p>`
  }, function(error, info){
    if(error){
      console.log(error);
    } else {
      console.log(info);
    };
  })

  if(subscribe){
    const mailChimp = new Mailchimp(config.mailchimp.key);
    mailChimp.post(`lists/${config.mailchimp.listId}`, {
      members: [{email_address: 'test', status: 'subscribed'}]
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))
  };
}