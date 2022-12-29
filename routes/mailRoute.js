require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();


router.post('/', async (req,res) =>{
    if(!req.body.name || 
        !req.body.email || 
        !req.body.message )  {
        res.status(400).json({err:"Bad request"})
        return;
    }

    if(!validateEmail(req.body.email) )  {
        res.status(400).json({message: "Invalid user data"})
        return;
    }

    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 465,
        secure: process.env.SMTP_TLS || true, 
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });

      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.DESTINATION_EMAIL,
        subject: `Нове звернення від ${req.body.name} - ${req.body.email}`,
        text: req.body.message,
        html: `<p>${req.body.message}</p>`
      })
      .then((e) => {
        console.log(e);
        res.status(200).json()
        })
      .catch ((e) => {
        console.error(e);
        res.status(503).json({message: "The service is temporarily unavailable"})
      })

})

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

module.exports = router;