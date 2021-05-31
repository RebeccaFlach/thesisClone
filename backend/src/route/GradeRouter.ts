import { Router } from 'express';
import StudentVue from 'studentvue.js';
import gradebook, {CourseEntity, Gradebook, GradeCalculationSummary} from '../model/GradeBook';
import _ from 'underscore';
// import commonData from '../../data/commonData';

export default class GradeRouter {
    student;
    router;
    constructor(){
        //login init student
        this.router = Router();
        StudentVue.login( 'https://student.tusd1.org', '1301246779', '3.1415fuckyou').then(student => {this.student = student})
        console.log('constructing')

        this.router.route('/grades').get((req, res:any) => {
            this.student?.getGradebook().then((gradesJSON:string) => {
                
                const gradebook = JSON.parse(gradesJSON).Gradebook as Gradebook;

                // console.log(gradebook)
                const courses = gradebook.Courses.Course;
                const courseGradeBooks = _(courses).map(course => course.Marks.Mark);

                // console.log(courseGradeBooks)
                const courseGrades = _(courseGradeBooks).pluck('CalculatedScoreRaw');

                console.log(courseGrades)
                res.json(courseGrades)
                // res.json(gradebook)

            })
            
        });
        
       
    }
}