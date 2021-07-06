import axios from "axios";
import xml2js from 'xml2js';
import convert from 'xml-js';

const Api = {
    loggedIn: false,
    user: '1301246779',
    pass: '3.1415fuckyou',

    login (username, password) {
        this.user = username;
        this.pass = password;
        this.loggedIn = true
    },

    request (method:string) {
        const pass = this.pass;
        const user = this.user
        return axios.post('https://student.tusd1.org/Service/PXPCommunication.asmx',
            `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/"><userID>${user}</userID><password>${pass}</password><skipLoginLog>1</skipLoginLog><parent>0</parent><webServiceHandleName>PXPWebServices</webServiceHandleName><methodName>${method}</methodName><paramStr>&lt;Parms&gt;&lt;ChildIntID&gt;0&lt;/ChildIntID&gt;&lt;/Parms&gt;</paramStr></ProcessWebServiceRequest></soap:Body></soap:Envelope>`,
            {headers:{
                'Content-Type': 'text/xml; charset=utf-8',
                SOAPAction: 'http://edupoint.com/webservices/ProcessWebServiceRequest'
                }
            }, 
        )
    },

    parseData(promise) {
        return promise.then((res) =>  {
            // console.log(res)
            const response = convert.xml2js(res.data, {compact: true});

            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            )

            // console.log(data)
            
            return data;
        })

        .catch(console.log)
        
    },

    getMessages():Promise<any> {
        return this.parseData(this.request('GetPXPMessages'))
            .then((messageData) => messageData.PXPMessagesData.MessageListings.MessageListing)
    },

    getGrades() {
        return this.parseData(this.request('Gradebook'))
            .then((gradebook) => {
                const courses = gradebook.Gradebook.Courses.Course;

                console.log(courses[1])
                const summary = courses.map((course) => {
                    //_.pick
                    return {
                        title: course._attributes.Title,
                        teacher: course._attributes.Staff,
                        room: course._attributes.Room,
                        grade: course.Marks.Mark._attributes.CalculatedScoreRaw,
                        letterGrade: course.Marks.Mark._attributes.CalculatedScoreString,
                        assignments: course.Marks.Mark.Assignments.Assignment

                    }
                });

                // console.log(summary)
                return summary;
            })
    }

}

export default Api;