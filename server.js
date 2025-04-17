const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const mongoose = require('mongoose');
require('dotenv').config();

const mainRoute = require('./Routes/main');
const loginRoute = require('./Routes/admin');

(async function () {
  try {
    mongoose.connect(process.env.dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }, () => {
      console.log('The Database is ready to establish connection!!');
    });
  } catch (error) {
    console.log(error);
    console.log('The Database did not Connect!!!');
  }

  await mongoose.connection.once('open', () => {
    console.log('Connection Succesfully Established Connection');
  });
}());


const app = express();
const port = process.env.PORT || 5000;
const corsOption = {
  origin: ['http://localhost:3000', 'https://sigmadelivery-frontend.pages.dev', 'https://sladatransport.com', 'https://topdovelogistics.online', 'https://globateesla.site/'],
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOption));

app.use('/track', mainRoute);
app.use('/admin', loginRoute);

app.get('/', (req, res) => {
  res.send('The Site is Up and Running');
});

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});

(function serverWorker() {
  cron.schedule('*/10 * * * *', async () => {
    console.log('Trying to hit the API');
    const date = new Date();
    const hours = date.getUTCHours();
    console.log(hours);

    if (hours > 6) {
      const options = {
        method: 'GET',
        url: 'https://sigmadelivery.herokuapp.com/',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };
      console.log('Hit the API');

      const response = await axios(options);
      // console.log(response.data);

      // const portCondition = port === 5000 ? 'Relaks Development Robot' : 'Relaks Robot';

      // if (response.status === 200) {
      //   const mailSend = {
      //     from: process.env.Email,
      //     to: process.env.User,
      //     subject: 'Your site is still Online',
      //     html: `
      //     <h4>Hello Admin,</h4>
      //       Your site is still online. I will continually check the site every ten minutes to make sure everything is working fine. 
      //     <h4><b>${portCondition}</b></h4>`,
      //   };

      //   admin_transporter.sendMail(mailSend, (err, info) => {
      //     if (err) {
      //       console.log(chalk.red(`The Admin with email ${process.env.admin_email} did not recieved the mail: ${err.response}`));
      //     } else {
      //       console.log(chalk.green(`The message was sent ${info.response}`));
      //     }
      //   });
      // } else {
      //   return null;
      // }
    } else {
      return null;
    }
  });
}());
