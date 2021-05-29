import RouterBase from './RouterBase'

// import commonData from '../../data/commonData';

export default class TestRouter extends RouterBase {


    constructor(){
        
        super();

        this.router.route('/getAuthState').get(async (req, res, next) => {
            console.log('************** getAuthState *************')

         
            const authInfo = { 
                authed: req.session?.authed || false, 
                count: req.session?.test,
                userId: req.session?.userId
            };

            res.json(authInfo)
        })

        this.router.route('/helloWorld').get((req, res) => {
            res.json({ message: "hello, world"})
        });
        
        this.router.use(multer().any());

        
        // ********************  everything route onwards requires authn ************************/
        this.router.use(authn)
        // ************************************************************************************/

    }
}