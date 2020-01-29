const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');
const Mailchimp = require('mailchimp-api-v3');
const config = require('../config.js');
const template = require('./htmlMailTemplate');
const moment = require('moment-timezone');


let transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: config.mandrill.key
  }
}));

module.exports = (data = null, subscribe = false, forCancel = false, forRemove = false, forUpdate = false, forAutomate = false) => {
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
  let showName = 'Barkley L. Hendricks and Lorna Simpson: Collected Works';

  let staffMessage = `<p ${style}> ${showName} <br> ${data.eventDate} <br> ${guests} </p>
    <p ${style}> ${data.name} - <a ${anchorStyle} href="mailto:${data.email}">${data.email}</a> </p>
    <p ${style}> To manage this booking, please click <a ${anchorStyle} href="${config.manageBookingUrl + data.EventId}">here.</a> </p>
    <p ${style}> To manage this tour, please click <a ${anchorStyle} href="">here.</a> </p>
  `;

  if(forCancel){
    emailStaff = true;
    staffSubject = 'You have a new cancellation.';
    subject = 'Booking Cancelled';
    message = `<p ${style}> Your <strong>rennie museum</strong> tour has been cancelled for: </p>
    <p ${style}> ${showName} <br> ${data.eventDate} <br> ${guests} <br> </p>
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
    <p ${style}> ${showName} <br/> ${data.eventDate} <br/> ${guests} <br/> <a ${anchorStyle} href="https://goo.gl/maps/GWSE5v7k7MP2">Click here for directions to the museum.</a> </p>
    <p ${style}> All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
    <p ${style}> If you need to edit or cancel your booking, please <i>click <a ${anchorStyle} href="${config.cancelLink + data.hash}">here</a>. </i> </p>
    <p ${style}> If you have any other questions please contact us at <a href="mailto:contact@renniemuseum.org" ${anchorStyle}>contact@renniemuseum.org</a> </p>
    <p ${style}> We look forward to welcoming you! </p>
    <p ${style}> <strong>rennie museum</strong> </p>
    `;
  } else if(forAutomate) {
    subject = 'rennie Tour Reminder';
    let automateGuests;
    if(data.guests){
      if(data.guests.length === 0){
        automateGuests = '1 guest';
      } else {
        automateGuests = `${data.guests.length + 1} guests`;
      };
    };
    message = `
    <p ${style}> This is a reminder of your confirmed visit to the rennie museum for ${automateGuests} on ${data.eventDate}. All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
    <p ${style}> If you are unable to keep your appointment, please manage your booking <a ${anchorStyle} href="${config.cancelLink + data.hash}">here</a>.</p>
    <p ${style}> We look forward to welcoming you! </p>
    <p ${style}> <strong>rennie museum</strong> </p>
    `;
  } else {
    emailStaff = true;
    subject = 'Booking Confirmation';
    staffSubject = 'You have a new booking.';
    message = `<p ${style}> Thank you for booking a visit to <strong>rennie museum.</strong> </p>
     <p ${style}> Here are your booking details: </p>
     <p ${style}> ${showName} <br> ${data.eventDate} <br> ${guests} <br> <a ${anchorStyle} href="https://goo.gl/maps/GWSE5v7k7MP2">Click here for directions to the museum.</a> </p>
     <p ${style}> All tours begin promptly at the scheduled time. Please arrive 5 minutes prior to your scheduled appointment so you have time to sign in and get oriented. </p>
     <p ${style}> If you need to edit or cancel your booking, please <i>click <a ${anchorStyle} href="${config.cancelLink + data.hash}">here</a>. </i> </p>
     <p ${style}> Visitors to the Museum, by participating in a Museum tour or by entering the Museum, will be deemed to have agreed to comply with our <a ${anchorStyle} href="https://rennie-museum.s3.ca-central-1.amazonaws.com/public/Waiver+of+Claims+and+Release+of+Liability.pdf" target="blank">terms and conditions</a>. </p>
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
      members: [{
        email_address: data.email, 
        status: 'subscribed', 
        merge_fields: {
          FNAME: data.name,
          LNAME: ''
        }
      }]
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))
  };
}
