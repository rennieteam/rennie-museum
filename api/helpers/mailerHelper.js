const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');
const Mailchimp = require('mailchimp-api-v3');
const config = require('../config.js');
const template = require('./htmlMailTemplate');


let transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: config.mandrill.key
  }
}));

module.exports = (data = null, subscribe = false, forCancel = false, forRemove = false, forUpdate = false) => {
  let message, subject, staffSubject;
  let emailStaff = false;
  let guests = '';
  if(data.guests){
    if(data.guests.length === 0){
      guests = 'No Guests';
    } else if(data.guests.length === 1){
      guests = '1 Guest';
    } else {
      guests = `${data.guests.length} Guests`;
    };
  };

  let staffMessage = `<p> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} </p>
    <p> ${data.name} - ${data.email} </p>
    <p> To manage this booking, please click <a href="${config.manageBookingUrl + data.EventId}">here.</a> </p>
    <p> To manage this tour, please click <a href="">here.</a> </p>
  `;

  if(forCancel){
    emailStaff = true;
    staffSubject = 'You have a new cancellation.';
    subject = 'Booking Cancelled';
    message = `<p> Your <strong>rennie museum</strong> tour has been cancelled for: <p>
    <p> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} </p>
    <p> If you need to create a new booking, please <i>click <a href="${config.homeLink}">here</a>. </i> </p>
    <p> If you have any other questions please contact us at contact@renniemuseum.org </p>
    <p> Thank you, </p>
    <p> <strong>rennie museum</strong> </p>
    `;
  } else if(forRemove){
    subject = 'Booking Removal'
    message = 'you have been removed from your tour';
  } else if(forUpdate) {
    emailStaff = true;
    staffSubject = 'You have a new booking update.';
    subject = 'Updated Booking Confirmation';
    message = `<p> Thank you for updating your tour booking at <strong>rennie museum.</strong> <p>
    <p> Here are your new booking details: </p>
    <p> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} </p>
    <p> All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
    <p> If you need to edit your booking, please <i>click <a href="${config.cancelLink + data.hash}">here</a>. </i> </p>
    <p> If you have any other questions please contact us at contact@renniemuseum.org </p>
    <p> We look forward to welcoming you! </p>
    <p> <strong>rennie museum</strong> </p>
    `;
  } else {
    emailStaff = true;
    subject = 'Booking Confirmation';
    staffSubject = 'You have a new booking.';
    message = `<p> Thank you for booking a visit to <strong>rennie museum.</strong> <p>
     <p> Here are your booking details: </p>
     <p> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} </p>
     <p> All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
     <p> If you need to edit your booking, please <i>click <a href="${config.cancelLink + data.hash}">here</a>. </i> </p>
     <p> If you have any other questions please contact us at contact@renniemuseum.org </p>
     <p> We look forward to welcoming you! </p>
     <p> <strong>rennie museum</strong> </p>
     `;
  };
    
  if(emailStaff){
    transport.sendMail({
      from: config.mandrill.noReply,
      to: config.mandrill.staffAddress,
      subject: staffSubject,
      html: template.getTemplate(staffMessage)
    }, function(error, info){
      if(error){
        console.log(error);
      } else {
        console.log(info)
      }
    })
  };

  transport.sendMail({
    from: config.mandrill.fromAddress,
    to: data.email,
    subject: subject,
    html: template.getTemplate(message)
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
