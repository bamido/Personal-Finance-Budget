const sendgrid = require('@sendgrid/mail');
require('dotenv').config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sendgrid.setApiKey(SENDGRID_API_KEY);

module.exports = sendgrid;