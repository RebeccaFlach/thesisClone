import { Router } from 'express';
import gradebook, {CourseEntity, Gradebook, GradeCalculationSummary} from '../model/GradeBook';
import SVMessages from '../model/Messages';
import axios, { AxiosResponse } from 'axios'
import _ from 'underscore';
import convert from 'xml-js';

export default class GradeRouter {
    router;
    request;
    parseData;
    domain;
    user;
    pass;
    constructor(){
        this.domain = 'https://student.tusd1.org';
        this.user = '1301246779';
        this.pass = '3.1415fuckyou';
        console.log('router')
        this.router = Router();
        
        this.request = (method:string, params={}) => {
            // if(!this.user)
            //     await this.login()
          
    
            let paramStr = '&lt;Parms&gt;';
            Object.entries(params).forEach(([key, value]) => {
                paramStr += '&lt;' + key + '&gt;';
                paramStr += value;
                paramStr += '&lt;/' + key + '&gt;';
            });
            paramStr += '&lt;/Parms&gt;';
            

            return axios.post(`${this.domain}/Service/PXPCommunication.asmx`,
                `<?xml version="1.0" encoding="utf-8"?>\n
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                            <userID>${this.user}</userID>
                            <password>${this.pass}</password>
                            <skipLoginLog>1</skipLoginLog>
                            <parent>0</parent>
                            <webServiceHandleName>PXPWebServices</webServiceHandleName>
                            <methodName>${method}</methodName>
                            <paramStr>${paramStr}</paramStr>
                        </ProcessWebServiceRequest>
                    </soap:Body>
                </soap:Envelope>`,
    
                {headers:{
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://edupoint.com/webservices/ProcessWebServiceRequest'
                    }
                }, 
            ).then(res => this.parseData(res))
        },

        // this.parseData = (res) => {
        //     const resData = JSON.parse(parser.toJson(res.data))

        //     return JSON.parse(parser.toJson(resData['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult))
        // }

        this.parseData = (res) => {
            const response = convert.xml2js(res.data, {compact: true});

            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            ) as any;

            if (data.RT_ERROR)
                return Promise.reject(data.RT_ERROR._attributes.ERROR_MESSAGE)

            return data;
        }
        //https://localhost:6001/api/grade/messages

        this.router.route('/messages').get(async (req, res) => {
            const data = await this.request('GetPXPMessages') as SVMessages;

            const messages = data?.PXPMessagesData?.MessageListings?.MessageListing;
            //todo: transform data
               
            res.json(messages);
        })
        

        this.router.route('/grades').get(async (req, res) => {
            console.log('HIIIII')
            const gradebook = await this.request('Gradebook') as gradebook;
            const courses:any = gradebook?.Gradebook?.Courses?.Course || [];
                
                const summary = courses.map((course) => {

                    //love xml parsing
                    let svAssignments = course.Marks.Mark.Assignments.Assignment as any;
                    let assignments;
                    if (svAssignments){
                        assignments = _(svAssignments).map((a) => {
                            const assignment = a._attributes || a; 
                            return {
                                name: assignment.Measure,
                                id: assignment.GradebookID,
                                points: assignment.Points,
                            }
                        })
                    }
                    else 
                        assignments = [];

                    return {
                        title: course._attributes.Title,
                        teacher: course._attributes.Staff,
                        room: course._attributes.Room,
                        grade: course.Marks.Mark._attributes.CalculatedScoreRaw,
                        letterGrade: course.Marks.Mark._attributes.CalculatedScoreString,
                        assignments: assignments,

                    }
                });


                res.json(summary);
        })

        this.router.route('/history').get(async(req, res) => {

            const getAuthToken = () => {
                const params = {
                    username: this.user,
                    TokenForClassWebsite: true,
                    Usertype: 0,
                    IsParentStudent: 0,
                    DocumentID: 1,
                    AssignmentID: 1
                }
        
                return this.request('GenerateAuthToken', params).then(data => data.AuthToken._attributes.EncyToken)
            }

            const token = await getAuthToken();

            let historyRes:AxiosResponse<any>;
            let data;
            try {
                historyRes = await axios.get(`${this.domain}/PXP2_CourseHistory.aspx?token=${token}&AGU=0`)
                data = historyRes.data;
                
            }
            catch (err) {
                //handle error
                res.json(null);
                return;
            }
            
            

            const find = (start, end, startAt?) => {
                let toSearch = data.substring(startAt || 0);
                const startI = toSearch.indexOf(start) + start.length;
                toSearch = toSearch.substring(startI);

                let endI = toSearch.indexOf(end);

                return toSearch.substring(0, endI)
            }

            let unweighted = find('<span class="gpa-score">', '</span>')
            if (isNaN(parseFloat(unweighted)))
                unweighted = 'N/A'

            let weighted = find('<span class="gpa-score">', '</span>', data.indexOf('Weighted'))
            if (isNaN(parseFloat(weighted)))
                weighted = 'N/A'

            const historyStr = find('PXP.CourseHistory =', ';', data.indexOf('PXP.CourseHistory =')).trim()
            const courseHistory = JSON.parse(historyStr); //start and end of array inside js
            const formattedData = {
                unweighted: unweighted, 
                weighted: weighted, 
                history: courseHistory
            }

            res.json(formattedData);
        })

        this.router.route('/documents').get(async (req, res) => {
            const svDocuments = await this.request('GetStudentDocumentInitialData');
            const documents = svDocuments.StudentDocuments.StudentDocumentDatas.StudentDocumentData
            
            const formatted = documents.map(doc => doc._attributes);
            res.json(formatted);
        })

        this.router.route('/document:docID').get(async (req, res) => {
            console.log(req.params.docID)
            // res.json(null)
            // return;

            const svDocument = await this.request('GetContentOfAttachedDoc', { DocumentGU: req.params.docID});
            const doc = svDocument.StudentAttachedDocumentData.DocumentDatas.DocumentData
            
            
            res.json(doc);
        })

        this.router.route('/schedule').get(async (req, res) => {
            const svSchedule = await this.request('StudentClassList');

            const schedule = svSchedule.StudentClassSchedule?.ClassLists?.ClassListing || [];

            
            const formatted = _(schedule).map(course => {
                const courseInfo = course._attributes
                return {
                    title: courseInfo.CourseTitle,
                    period: courseInfo.Period,
                    room: courseInfo.RoomName,
                    teacher: courseInfo.Teacher,
                    teacherEmail: courseInfo.TeacherEmail
                }
            })

            res.json(formatted);
        })

        this.router.route('/studentInfo').get(async (req, res) => {
            const svInfo = await this.request('StudentInfo');
            res.json(svInfo.StudentInfo);
        })

        this.router.route('/ping').get((req, res) => {
            console.log('ping')
            res.json({message: 'pong!'})
        })



       
    }
}