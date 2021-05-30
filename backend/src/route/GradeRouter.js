import { Router } from 'express';
import StudentVue from 'studentvue.js'

// import commonData from '../../data/commonData';

export default class GradeRouter {
    //student
    router;
    constructor(){
        //login init student
        this.router = Router();

        this.router.route('/grades').get((req, res) => {
            StudentVue.login( 'https://student.tusd1.org', '1301246779', '3.1415fuckyou')
                .then((student) => {
                    student.getGradebook().then((grades) => {
                        console.log(grades)
                        res.json(grades)
                    })
                })
                
            
        });
        
       
    }
}