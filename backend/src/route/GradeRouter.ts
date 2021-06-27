import { Router } from 'express';
import StudentVue from 'studentvue.js';
import gradebook, {CourseEntity, Gradebook, GradeCalculationSummary} from '../model/GradeBook';
import Messages from '../model/Messages';
import axios from 'axios'
import _ from 'underscore';
import { AttendanceData } from '../model/Attendance';

export default class GradeRouter {
    router;
    constructor(){
        //login init student
        this.router = Router();

        this.router.route('/messages').get(async (req, res) => {
            console.log(req.session)
            const student = await StudentVue.login( 'https://student.tusd1.org', req.session.name, req.session.password);

            const messagesData = await student.getMessages();

            const messages = JSON.parse(messagesData) as Messages;
            // console.log(student)
            // console.log(messages);

            // res.json(messages)
            res.json(messages.PXPMessagesData.MessageListings.MessageListing);
        })

        this.router.route('/attendance').get(async (req, res) => {
            const student = await StudentVue.login( 'https://student.tusd1.org', req.session.name, req.session.password);

            const attendanceData = await student.getAttendance();

            // console.log(attendanceData)
            const attendance = JSON.parse(attendanceData) as AttendanceData;

            // console.log(attendance)
            res.json(attendance.Attendance.Absences.Absence)
        })
        
        this.router.route('/history').get(async (req, res) => {
            const student = await StudentVue.login( 'https://student.tusd1.org', req.session.name, req.session.password);

            const authRes = await student.getAuthToken()
            //why is it done this way? no fucking clue. this is how it is done in the app
            //gets auth token, then uses that to fetch html content (like on the website)
            const token = JSON.parse(authRes).AuthToken.EncyToken;
            
            const historyRes = await axios.get('https://student.tusd1.org/PXP2_CourseHistory.aspx?token=' + token + '&AGU=0')
            const content = historyRes.data;
            
            //there's js inside the html returned, which has an array with the data needed, find it
            const arrayIndex = content.indexOf('PXP.CourseHistory =') + 20;
            const arrayEnd = content.indexOf('PXP.Translations.CourseHistory') - 3;
            const history = JSON.parse(content.substring(arrayIndex, arrayEnd).trim());

            console.log(JSON.stringify(history))
            res.json(history)
          
            // const data = await student.listReportCards();
            // const history = JSON.parse(data);
            // console.log(data)

            // const docData = await student.listDocuments();
            // const docs = JSON.parse(docData)
            // console.log(docData)

            // res.json({reportCards: history, docs: docs})
        })


        this.router.route('/ping').get((req, res) => {
            console.log('ping')
            res.json({message: 'pong!'})
        })

        //nvm it does get "current" grades if not specified, but how they determine that is shit
        this.router.route('/login/:name/:pass').get(async (req, res) => {
            // console.log(req.session)
            console.log('logging in')
            console.log(req.params.name)
            req.session.name = req.params.name;
            req.session.password = req.params.pass;

            res.json({message: 'success!'})
        }),


        this.router.route('/grades/:gradePeriod').get(async (req, res) => {
            // console.time();

            console.log(req.session);
            const student = await StudentVue.login( 'https://student.tusd1.org', req.session.name, req.session.password);

            console.log(student)

            console.log(req.session);
            console.log(req.sessionID)

            req.session.test = true;
            console.log(req.params);
            // console.log(student);
            const gradePeriod = req.params.gradePeriod;

            const gradesJSON = await student.getGradebook(gradePeriod);
                // console.timeEnd();
            const gradebook = JSON.parse(gradesJSON).Gradebook as Gradebook;
            const courses = gradebook.Courses.Course;
            //pluck
            const courseGradeBooks = _(courses).map(course => course.Marks.Mark);

            // console.log(gradebook.ReportingPeriods.ReportPeriod)
            // console.log(courses)
            // console.log(courseGradeBooks)

            const summary = _(courses).map((course) => {
                //_.pick
                return {
                    title: course.Title,
                    grade: course.Marks.Mark.CalculatedScoreRaw,
                    letterGrade: course.Marks.Mark.CalculatedScoreString

                }
            })

            // console.log(courseGrades)
            res.json(summary)

            
            
        });
        
       
    }
}