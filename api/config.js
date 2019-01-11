module.exports = {
  allowedOrigin: ["http://localhost:3000", "http://localhost:3001"],
  mandrill: {
    key: 'Y1xdlViAVFhaFUu5XA5evA',
    fromAddress: 'museum@rennie.com',
    subject: 'Rennie Museum Booking'
  },
  mailchimp: {
    key: '7e4639a737b8f47ff585ded31f622d6a-us11',
    listId: '112ed28b88'
  },
  cancelLink: 'http://localhost:3001/event/cancel'
}