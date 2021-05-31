
import cors from 'cors';
import express from 'express';
// import auth from '../route/auth-router';
// import middle from './error-middleware';
import TestRouter from '../route/TestRouter.js'
import GradeRouter from '../route/GradeRouter.js'
import bodyParser from 'body-parser';
import StudentVue from 'studentvue.js'

const app = express();
const router = express.Router();

// env variables
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json(),cors())

// app.use(auth);

// app.all('*', (request, response) => {
//   StudentVue.login( 'https://student.tusd1.org', '1301246779', '3.1415fuckyou')
//   .then((student) => {
//    // student.getMessages().then(console.log)
//   })
//   console.log('Returning a 404 from the catch-all route');
//   return response.sendStatus(418);
// });

const testRouter = new TestRouter();
app.use('/api/test', testRouter.router);


const gradeRouter = new GradeRouter();
app.use('/api/grade', gradeRouter.router);

// error middleware
// app.use(middle);

//StudentVue.getDistrictUrls('85749').then(console.log);


const start = () => {
  app.listen(PORT, () =>{
    console.log(`Listening on port: ${PORT}`)
  })
}

export {start};

// export const stop = () => {
//   app.close(PORT, () => {
//     console.log(`Shut down on port: ${PORT}`)
//   })
// }