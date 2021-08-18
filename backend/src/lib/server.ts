
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

// error middleware
// app.use(middle);

//StudentVue.getDistrictUrls('85749').then(console.log);

// login( 'https://student.tusd1.org', '1301246779', '3.1415fuckyou')
// const method = 'GetPXPMessages';
// const user = '1301246779';
// const pass = '3.1415fuckyou'
// axios.post('https://student.tusd1.org/Service/PXPCommunication.asmx', 
//   `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/"><userID>${user}</userID><password>${pass}</password><skipLoginLog>1</skipLoginLog><parent>0</parent><webServiceHandleName>PXPWebServices</webServiceHandleName><methodName>${method}</methodName><paramStr>&lt;Parms&gt;&lt;ChildIntID&gt;0&lt;/ChildIntID&gt;&lt;/Parms&gt;</paramStr></ProcessWebServiceRequest></soap:Body></soap:Envelope>`,
//   {headers:{
//       'Content-Type': 'text/xml; charset=utf-8',
//       SOAPAction: 'http://edupoint.com/webservices/ProcessWebServiceRequest'
//     }
//   }, 
// ).then((res) => {console.log(res.data)})
// .catch((err) => {console.log(err.data)})


const start = () => {

  // var httpServer = http.createSserver(app);
  var httpsServer = https.createServer(app);

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