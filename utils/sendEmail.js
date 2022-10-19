const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { SEND_GRID_API_KEY, SENDER_EMAIL } = process.env;

const sendEmail = ({ to, subject, html }) => {
  sgMail.setApiKey(SEND_GRID_API_KEY);

  sgMail.send({
    from: SENDER_EMAIL,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
