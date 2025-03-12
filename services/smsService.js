const twilio = require('twilio')
const nodemailer = require("nodemailer");


const accountSid = process.env.TWILIO_ACC_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const phoneNo = process.env.TWILIO_VIRTUAL_PHONE


const client = twilio(accountSid, authToken)


async function createMessage(body, to){
    const message = await client.messages.create({
        body:body,
        from:phoneNo,
        to: to,
    })
    console.log(message);
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "95akshay75@gmail.com",
      pass: "yoyh qcla nbad wixo",
    },
  });


const sendEmail = async (body, reciver) =>{
    const info = await transporter.sendMail({
        from: '95akshay75@gmail.com',
        to: reciver, 
        subject: "OTP varification",
        text: body,
      });
    
      console.log("Message sent: %s", info.messageId);
}

module.exports = {
    createMessage,
    sendEmail,
};
