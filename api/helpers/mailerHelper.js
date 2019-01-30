const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');
const Mailchimp = require('mailchimp-api-v3');
const config = require('../config.js');

let transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: config.mandrill.key
  }
}));

module.exports = (data = null, subscribe = false, forCancel = false, forRemove = false) => {
  let message, link, linkText;
  if(forCancel){
    message = 'your tour has been cancelled';
    link = config.homeLink;
    linkText = 'Rebook';
  } else if(forRemove){
    message = 'you have been removed from your tour';
    link = config.homeLink;
    linkText = 'Rebook';
  } else {
    message = 'thank you for booking a tour';
    link = config.cancelLink;
    linkText = 'Edit/Cancel Booking';
  };

  transport.sendMail({
    from: config.mandrill.fromAddress,
    to: data.email,
    subject: 'Rennie Museum Booking',
    html: `<p> Hi ${data.name}, ${message}. <a href="${link}${data.hash}"> ${linkText} </a> </p>`
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