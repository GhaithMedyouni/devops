const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = (to, token) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        port: process.env.PORT_MAILER,
        secure: process.env.SECURE === 'true',
        auth: {
            user: process.env.USER_MAILER,
            pass: process.env.PASS_MAILER
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: 'YOUR SERVICE NAME <your-email@gmail.com>',
        to: to,
        subject: 'Confirmation Email',
        text: 'Thank you for registering. Your account has been successfully created.',
        html: `<p>Thank you for registering. Please click <a href="${process.env.BASE_URL}/admin/confirm/${token}">here</a> to confirm your email address.</p>`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
