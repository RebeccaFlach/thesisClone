import { Request, Router } from 'express';
import gradebook, {CourseEntity, Gradebook, GradeCalculationSummary} from '../model/GradeBook';
import {Messages}from '../model/Messages';
import axios, { AxiosResponse } from 'axios'
import _ from 'underscore';
import convert from 'xml-js';
import decoder from 'base-64';
import { Student, StudentInfo } from '../model/Student';
import { DocumentList } from '../model/DocumentList';
import { Document } from '../model/Document';
import { Schedule } from '../model/Schedule';



export default class GradeRouter {
    router;
    request;
    parseData;
    domain;
    getCredentials;
    getAuthToken;

    constructor(){
        this.domain = 'https://student.tusd1.org';
        this.router = Router();

        this.getCredentials = (auth) => {
            const decodedAuth = decoder.decode(auth.split(' ')[1]);
            
            let i = decodedAuth.indexOf(':');
            const user = decodedAuth.slice(0, i).replace('&', '&amp;');
            const pass = decodedAuth.slice(i + 1).replace('&', '&amp;');
            return [user, pass];
        }

        this.getAuthToken = (auth) => {
            const params = {
                username: decoder.decode(auth.split(' ')[1]).split(':')[0],
                TokenForClassWebsite: true,
                Usertype: 0,
                IsParentStudent: 0,
                DocumentID: 1,
                AssignmentID: 1
            }
    
            return this.request('GenerateAuthToken', auth, params).then(data => data.AuthToken._attributes.EncyToken).catch(err => Promise.reject(err))
        }
        
        this.request = (method:string, auth:string, params={}) => {
            let user:string;
            let pass:string;
            try {
                [user, pass] = this.getCredentials(auth);
            }
            catch {
                return null;
            }
          
            let paramStr = '&lt;Parms&gt;';
            Object.entries(params).forEach(([key, value]) => {
                let val = value as any;
                if (typeof val === 'string')
                    val = val.replace('&', '&amp;')
                paramStr += '&lt;' + key + '&gt;';
                paramStr += val;
                paramStr += '&lt;/' + key + '&gt;';
            });
            paramStr += '&lt;/Parms&gt;';
            
            

            return axios.post(`${this.domain}/Service/PXPCommunication.asmx`,
                `<?xml version="1.0" encoding="utf-8"?>\n
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                            <userID>${user}</userID>
                            <password>${pass}</password>
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
            .catch(err => {
                console.log(err)
                return Promise.reject(err);
            })
            // .catch(err => {
            //     console.log('error code:');
            //     console.log(err);

            //     console.log('---------------')
            // })
        },

        this.parseData = (res) => {
            const response = convert.xml2js(res.data, {compact: true});

            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            ) as any;

            if (data.RT_ERROR)
                return Promise.reject(data.RT_ERROR._attributes.ERROR_MESSAGE)

            return data;
        }

        this.router.route('/messages').get(async (req, res) => {
            try {
                const data = await this.request('GetPXPMessages', req.headers.authorization) as Messages;
                
                const messages = data?.PXPMessagesData?.MessageListings?.MessageListing;
                
                
                const formatted = _(messages).map((m) => {
                    
                    return {
                        subject: m._attributes.SubjectNoHTML,
                        html: m._attributes.Content,
                        from: m._attributes.From,
                        date: m._attributes.BeginDate,
                        attachments: m.AttachmentDatas.AttachmentData,
                        id: m._attributes.ID,
                        
                        
                    }
                })
                   
                res.json(formatted);
            }
            catch {

                res.json(null)
            }

           
        })
        

        this.router.route('/grades').get(async (req:Request, res) => {
            console.log('getting grades')
            
            const gradebook = await this.request('Gradebook', req.headers.authorization) as gradebook;
            // console.log(gradebook);
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
            const auth = req.headers.authorization;

            const token = await this.getAuthToken(auth);

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
            const svDocuments = await this.request('GetStudentDocumentInitialData', req.headers.authorization) as DocumentList;

            const documents = svDocuments.StudentDocuments.StudentDocumentDatas.StudentDocumentData;
            
            const formatted = documents?.map(doc => {
                const d = doc._attributes;
                return {
                    id: d.DocumentGU,
                    name: d.DocumentFileName,
                    type: d.DocumentType,
                    date: d.DocumentDate,
                    comment: d.DocumentComment
                }
            });
            res.json(formatted);
        })

        this.router.route('/document').get(async (req:Request, res) => {
            const svDocument = await this.request('GetContentOfAttachedDoc', req.headers.authorization, { DocumentGU: req.query.docID}) as Document;

            const doc = svDocument.StudentAttachedDocumentData.DocumentDatas.DocumentData;

            const formatted = {
                base64: doc.Base64Code._text
            }
            
            res.json(formatted);
        })

        this.router.route('/schedule').get(async (req, res) => {
            const svSchedule = await this.request('StudentClassList', req.headers.authorization) as Schedule;

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
            const data = await this.request('StudentInfo', req.headers.authorization) as Student;
            const svInfo = data.StudentInfo;

            const formattedData = {
                name: svInfo.FormattedName._text,
                id: svInfo.PermID._text,
                gender: svInfo.Gender._text,
                address: svInfo.Address._text,
                photo: svInfo.Photo._text
            }

            res.json(formattedData);
        })

        this.router.route('/ping').get((req, res) => {
            console.log('ping')
            res.json({message: 'pong!'})
        })

        this.router.route('/checkLogin').get(async (req, res) => {
             return this.getAuthToken(req.headers.authorization).then((res) => {
                res.json({message: 'Logged In Successfully'});
            })
            .catch(err => {
                console.log('WAS ERROR:')
                console.log(err)
                res.status(403).send({message: err})
            })
        })
       
    }
}