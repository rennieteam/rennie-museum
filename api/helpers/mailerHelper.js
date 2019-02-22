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
      guests = '1 Guest';
    } else {
      guests = `${data.guests.length + 1} Guests`;
    };
  };

  let style = `style="line-height: 1; color:black; font-size:12px; font-family:serif"`;
  let anchorStyle = `style="color:#DA291C;"`;

  let staffMessage = `<p ${style}> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} </p>
    <p ${style}> ${data.name} - <a ${anchorStyle} href="mailto:${data.email}">${data.email}</a> </p>
    <p ${style}> To manage this booking, please click <a ${anchorStyle} href="${config.manageBookingUrl + data.EventId}">here.</a> </p>
    <p ${style}> To manage this tour, please click <a ${anchorStyle} href="">here.</a> </p>
  `;

  if(forCancel){
    emailStaff = true;
    staffSubject = 'You have a new cancellation.';
    subject = 'Booking Cancelled';
    message = `<p ${style}> Your <strong>rennie museum</strong> tour has been cancelled for: </p>
    <p ${style}> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} <br> </p>
    <p ${style}> If you need to create a new booking, please <i>click <a ${anchorStyle} href="${config.homeLink}">here</a>. </i> </p>
    <p ${style}> If you have any other questions please contact us at <a href="mailto:contact@renniemuseum.org" ${anchorStyle}>contact@renniemuseum.org</a> </p>
    <p ${style}> Thank you, </p>
    <p ${style}> <strong>rennie museum</strong> </p>
    `;
  } else if(forRemove){
    subject = 'Booking Removal';
    message = 'You have been removed from your tour.';
  } else if(forUpdate) {
    emailStaff = true;
    staffSubject = 'You have a new booking update.';
    subject = 'Updated Booking Confirmation';
    message = `<p ${style}> Thank you for updating your tour booking at <strong>rennie museum.</strong> </p>
    <p ${style}> Here are your new booking details: </p>
    <p ${style}> Spring 2019: Collected Works <br/> ${data.eventDate} <br/> ${guests} <br/> <a ${anchorStyle} href="https://goo.gl/maps/GWSE5v7k7MP2">Click here for directions to the museum.</a> </p>
    <p ${style}> All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
    <p ${style}> If you need to edit your booking, please <i>click <a ${anchorStyle} href="${config.cancelLink + data.hash}">here</a>. </i> </p>
    <p ${style}> If you have any other questions please contact us at <a href="mailto:contact@renniemuseum.org" ${anchorStyle}>contact@renniemuseum.org</a> </p>
    <p ${style}> We look forward to welcoming you! </p>
    <p ${style}> <strong>rennie museum</strong> </p>
    `;
  } else {
    emailStaff = true;
    subject = 'Booking Confirmation';
    staffSubject = 'You have a new booking.';
    message = `<p ${style}> Thank you for booking a visit to <strong>rennie museum.</strong> </p>
     <p ${style}> Here are your booking details: </p>
     <p ${style}> Spring 2019: Collected Works <br> ${data.eventDate} <br> ${guests} <br> <a ${anchorStyle} href="https://goo.gl/maps/GWSE5v7k7MP2">Click here for directions to the museum.</a> </p>
     <p ${style}> All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
     <p ${style}> If you need to edit your booking, please <i>click <a ${anchorStyle} href="${config.cancelLink + data.hash}">here</a>. </i> </p>
     <p ${style}> If you have any other questions please contact us at <a href="mailto:contact@renniemuseum.org" ${anchorStyle}>contact@renniemuseum.org</a> </p>
     <p ${style}> We look forward to welcoming you! </p>
     <p ${style}> <strong>rennie museum</strong> </p>
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
