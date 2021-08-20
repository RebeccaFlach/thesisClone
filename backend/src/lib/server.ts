
import cors from 'cors';
import express from 'express';
// import auth from '../route/auth-router';
// import middle from './error-middleware';
import TestRouter from '../route/TestRouter.js'
import GradeRouter from '../route/GradeRouter.js'
import bodyParser from 'body-parser';
// import {login} from '../studentvue.js/index.js'
import session from 'express-session';
import _ from 'underscore';
const app = express();
const router = express.Router();
import https from 'https';
import http from 'http';
import fs from 'fs';
import axios from 'axios';
// env variables
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json(),cors())


  // let privateKey =  fs.readFileSync('mren-na1-localhost.io.key');
  // let cert = fs.readFileSync('mren-na1-localhost.io.crt');
  // var credentials = {key: privateKey, cert: cert};


app.use(cors({
  credentials: true,
  origin: (origin, cb) => {
    console.log(origin)
    const origins = [
      'https://localhost:3000', 
      'https://localhost:6001', 
      'https://mren-na1-localhost.io:3000', 
      'https://mren-na1-localhost.io:6001', 
      'http://localhost:19006',
      'http://10.10.10.84:19006' ];
    if(origin && !_(origins).contains(origin)){  
      cb(new Error('Origin CORS not allowed'))    
      console.log('fucked up');
      return
    }
    
    cb(null, true);
    
  }
}))
// app.use(auth);

app.all('*', (request, response) => {
  return response.sendStatus(404);
});

app.use(session({
  secret:'Keep it secret', 
  name:'sessionTest', 
  saveUninitialized:true, 
  resave: false,
  cookie: {
    domain: 'mren-na1-localhost.io',
    sameSite: "none",
    secure: true,
    httpOnly: false,
  }
}))

const testRouter = new TestRouter();
app.use('/api/test', testRouter.router);


const gradeRouter = new GradeRouter();
app.use('/api/grade', gradeRouter.router);



const start = () => {

  // var httpServer = http.createSserver(app);
  var httpsServer = http.createServer(app);

  httpsServer.listen(PORT, () =>{
    console.log(`Listening on port: ${PORT}`)
  })
}

export {start};

// export const stop = () => {
//   app.close(PORT, () => {
//     console.log(`Shut down on port: ${PORT}`)
//   })
// }