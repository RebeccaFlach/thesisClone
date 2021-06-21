import { Router } from 'express';
import StudentVue from 'studentvue.js';
import gradebook, {CourseEntity, Gradebook, GradeCalculationSummary} from '../model/GradeBook';
import _ from 'underscore';
// import commonData from '../../data/commonData';

export default class GradeRouter {
    router;
    constructor(){
        //login init student
        this.router = Router();
        console.log('making instance')
        //initial request thing- 

        //optional param- if included get that grading period, otherwise look at date and get current one
            //2 requests, 10sec wait time AHHHHH
        //or, remember where user was and go to that one


        //nvm it does get "current" grades if not specified, but how they determine that is shit

        this.router.route('/grades/:gradePeriod/:name/:pass').get(async (req, res) => {
            // console.time();
            const student = await StudentVue.login( 'https://student.tusd1.org', req.params.name, req.params.pass);


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
            const courseGradeBooks = _(courses).map(course => course.Marks.Mark);

            // console.log(gradebook.ReportingPeriods.ReportPeriod)
            // console.log(courses)
            // console.log(courseGradeBooks)

            const courseGrades = _(courseGradeBooks).pluck('CalculatedScoreRaw');

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