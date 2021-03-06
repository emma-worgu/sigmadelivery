const route = require('express').Router();
const fs = require('fs');
const nodemailer = require('nodemailer');

const MainModel = require('../Model/track');

const admin_transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.admin_email,
    pass: process.env.admin_pass,
  },
});

route.post('/', async (req, res) => {
  try {
    let trackdoc;
    try {
      trackdoc = fs.readFileSync(`${req.body.trackNumber}.js`);
    } catch (e) {
      return res.status(404).json({
        message: 'No item Found. Check your Track Number and try again',
      });
    }
    const stringifyTrackDoc = JSON.parse(trackdoc);

    // const mailSend = {
    //   from: process.env.Email,
    //   to: customers[v].email,
    //   subject: 'Tracking Number has been tracked',
    //   text: `This tracking number ${}`,
    // };

    // admin_transporter.sendMail(mailSend, (err, info) => {
    //   if (err) {
    //     console.log(chalk.red(`The Admin with email ${customers[v].email} did not recieved the mail: ${err.response}`));
    //   } else {
    //     console.log(chalk.green(`The message was sent ${info.response}`));
    //   }
    // });

    return res.json({
      doc: stringifyTrackDoc,
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      err: "Something Went Wrong",
    });
  }
});

route.post('/add', async(req, res) => {
  try {
    const num = Math.floor(Math.random() * 1000000)
    console.log(num);
    const data = {
      trackNumber: `col-TN-${num}`,
      location: req.body.location,
    };
  
    const stringifyData = JSON.stringify(data)
  
    fs.writeFileSync(`${data.trackNumber}.js`, stringifyData, (err) => {
      if (err) {
        console.log(err)
      }
  
      console.log('successfully created');
    });
  
    return res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed. Something Went Wrong!!',
    });
  }
});

route.post('/update-location', (req, res) => {
  const trackNumber = req.body.trackNumber;

  try {
    fs.readFileSync(`${trackNumber}.js`);
  } catch (e) {
    return res.status(404).json({
      message: "No Tracking Number Found. Please Contact system administrator",
    });
  }

  const data = {
    trackNumber,
    location: req.body.location,
  }

  const stringifyData = JSON.stringify(data);

  try {
    fs.writeFileSync(`${trackNumber}.js`, stringifyData);
  } catch (error) {
    return res.status(400).json({
      message: 'The Location could not be updated. Please Contact system administrator',
    });
  }

  return res.status(200).json({
    message: 'Saved Successfully',
  });
});

module.exports = route;