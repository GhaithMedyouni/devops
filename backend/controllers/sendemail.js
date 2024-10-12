const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (to, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAILER,
        port: process.env.PORT_MAILER,
        secure: process.env.SECURE_MAILER === 'true', // Use environment variable to control secure flag
        auth: {
          user: process.env.USER_MAILER,
          pass: process.env.PASS_MAILER,
        },
        tls: {
          rejectUnauthorized: false, // Allow unauthorized certs (optional, should be used cautiously)
        },
      });

    const mailOptions = {
        from: process.env.USER_MAILER,
        to: to,
        subject: 'Confirmation Email',
        text: 'Thank you for registering. Your account has been successfully created.',
        html: `<p>Thank you for registering. Please click <a href="${process.env.BASE_URL}/admin/confirm/${token}">here</a> to confirm your email address.</p>`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
