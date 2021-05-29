'use strict'

import cors from 'cors';
import express from 'express';
// import auth from '../route/auth-router';
// import middle from './error-middleware';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import StudentVue from 'studentvue.js'

const app = express();
const router = express.Router();

// env variables
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json(),cors())

// app.use(auth);

app.all('*', (request, response) => {
  StudentVue.login( 'https://student.tusd1.org', '1301246779', '3.1415fuckyou')
  .then((student) => {
   // student.getMessages().then(console.log)
  })
  console.log('Returning a 404 from the catch-all route');
  return response.sendStatus(418);
});

// error middleware
// app.use(middle);

//StudentVue.getDistrictUrls('85749').then(console.log);


export const start = () => {
  app.listen(PORT, () =>{
    console.log(`Listening on port: ${PORT}`)
  })
}

export const stop = () => {
  app.close(PORT, () => {
    console.log(`Shut down on port: ${PORT}`)
  })
}