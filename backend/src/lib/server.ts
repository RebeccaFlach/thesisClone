import cors from 'cors';
import express from 'express';
import TestRouter from '../route/TestRouter.js'
import GradeRouter from '../route/GradeRouter.js'
import bodyParser from 'body-parser';
import session from 'express-session';
import _ from 'underscore';
const app = express();

import http from 'http';


const PORT = process.env.PORT || 5001;

app.use(bodyParser.json(),cors())



app.use(cors({
  credentials: true,
  origin: (origin, cb) => {
    console.log(origin)
    const origins = [
      'https://localhost:3000', 
      'https://localhost:6001', 
      'http://localhost:19006',
      'http://10.10.10.84:19006' 
    ];

    if(origin && !_(origins).contains(origin)){  
      cb(new Error('Origin CORS not allowed'))    
      return
    }
    
    cb(null, true);
    
  }
}))
// app.use(auth);


const testRouter = new TestRouter();
app.use('/api/test', testRouter.router);


const gradeRouter = new GradeRouter();
app.use('/api/grade', gradeRouter.router);



const start = () => {

  var httpServer = http.createServer(app);

  httpServer.listen(PORT, () =>{
    console.log(`Listening on port: ${PORT}`)
  })
}

export {start};

// export const stop = () => {
//   app.close(PORT, () => {
//     console.log(`Shut down on port: ${PORT}`)
//   })
// }