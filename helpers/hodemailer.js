const nodemailer = require("nodemailer");
const { PASSWORD_MAIL, USERNAME_MAIL } = require("../constants/env");

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: USERNAME_MAIL,
    pass: PASSWORD_MAIL,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (payload) => {
  try {
    const email = {
      ...payload,
      from: USERNAME_MAIL,
    };
    const res = await transporter.sendMail(email);
    return res;
  } catch (error) {
    console.log("Error in sending",error.message);
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
