import { Router } from 'express';

// import commonData from '../../data/commonData';

export default class TestRouter {

    constructor(){
        this.router = Router();

        this.router.route('/helloWorld').get((req, res) => {
            res.status(200).json({ message: "Hello world"})
        });
        
       
    }
}