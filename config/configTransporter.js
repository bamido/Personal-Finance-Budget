const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'mail.visasv.com',
    port: 587,
    auth: {
        user: "visaconfirmation@visasv.com",
        pass: "retsam#asiv"
    }
})


module.exports = transporter;