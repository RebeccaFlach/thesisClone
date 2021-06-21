
import cors from 'cors';
import express from 'express';
// import auth from '../route/auth-router';
// import middle from './error-middleware';
import TestRouter from '../route/TestRouter.js'
import GradeRouter from '../route/GradeRouter.js'
import bodyParser from 'body-parser';
import StudentVue from 'studentvue.js'
import session from 'express-session';
import _ from 'underscore';
const app = express();
const router = express.Router();
import https from 'https';
import http from 'http';
import fs from 'fs';

// env variables
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json(),cors())


  let privateKey =  fs.readFileSync('mren-na1-localhost.io.key');
  let cert = fs.readFileSync('mren-na1-localhost.io.crt');
  var credentials = {key: privateKey, cert: cert};


app.use(cors({
  credentials: true,
  origin: (origin, cb) => {
    const origins = [ 'https://localhost:3000', 'https://localhost:5000', 'https://mren-na1-localhost.io:3000', 'https://mren-na1-localhost.io:5000' ];
    if(origin && // 2020.05.18 ERL - undefined if same-origin on prod?
      !_(origins).contains(origin)){  // on local/dev, matches whitelist
      // debug.logError(new Error("cors check failed: " + origin + " not in [" + config.CORS_ORIGINS.join(',') + "]"), "CORS error")
      cb(new Error('Origin CORS not allowed'))    
      console.log('fucked up');
      return
    }
    
    cb(null, true);
    
  }
}))
// app.use(auth);

// app.all('*', (request, response) => {
//   StudentVue.login( 'https://student.tusd1.org', '1301246779', '3.1415fuckyou')
//   .then((student) => {
//    // student.getMessages().then(console.log)
//   })
//   console.log('Returning a 404 from the catch-all route');
//   return response.sendStatus(418);
// });
app.use(session({
  secret:'Keep it secret', 
  name:'uniqueSessionID', 
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

// error middleware
// app.use(middle);

//StudentVue.getDistrictUrls('85749').then(console.log);



const start = () => {

  // var httpServer = http.createServer(app);
  var httpsServer = https.createServer(credentials, app);

  httpsServer.listen(5000, () =>{
    console.log(`Listening on port: ${PORT}`)
  })
}

export {start};

// export const stop = () => {
//   app.close(PORT, () => {
//     console.log(`Shut down on port: ${PORT}`)
//   })
// }