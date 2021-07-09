import axios from "axios";
import xml2js from 'xml2js';
import convert from 'xml-js';

import React from "react";

const Api = {
    loggedIn: false,
    user: '',
    pass: '',
    domain: '',

    login (domain, username, password) {
        this.domain = domain;
        this.user = username;
        this.pass = password;
        this.loggedIn = true;

    },

    request (method:string, params={}) {

        let paramStr = '&lt;Parms&gt;';
        Object.entries(params).forEach(([key, value]) => {
            paramStr += '&lt;' + key + '&gt;';
            paramStr += value;
            paramStr += '&lt;/' + key + '&gt;';
        });
        paramStr += '&lt;/Parms&gt;';


        return axios.post(`https://${this.domain}/Service/PXPCommunication.asmx`,
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
        )
    },

    parseData(promise) {
        return promise.then((res) =>  {

            const response = convert.xml2js(res.data, {compact: true});

            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            )

            return data;
        })

        .catch(console.log)
        
    },

    getMessages():Promise<any> {
        if (!this.loggedIn)
            return Promise.resolve(null)
        return this.parseData(this.request('GetPXPMessages'))
            .then((messageData) => messageData.PXPMessagesData.MessageListings.MessageListing)
    },

    getGrades() {
        if (!this.loggedIn)
            return Promise.resolve(null)

        return this.parseData(this.request('Gradebook'))
            .then((gradebook) => {
                const courses = gradebook.Gradebook.Courses.Course;
                
                const summary = courses.map((course) => {
                    return {
                        title: course._attributes.Title,
                        teacher: course._attributes.Staff,
                        room: course._attributes.Room,
                        grade: course.Marks.Mark._attributes.CalculatedScoreRaw,
                        letterGrade: course.Marks.Mark._attributes.CalculatedScoreString,
                        assignments: course.Marks.Mark.Assignments.Assignment

                    }
                });

                return summary;
            })
    },

    getAuthToken() {
        if (!this.loggedIn)
            return Promise.resolve(null)

        const params = {
            username: this.user,
            TokenForClassWebsite: true,
            Usertype: 0,
            IsParentStudent: 0,
            DocumentID: 1,
            AssignmentID: 1
        }

        return this.parseData(this.request('GenerateAuthToken', params)).then(data => data.AuthToken._attributes.EncyToken)
    },

    async getHistory() {
        if (!this.loggedIn)
            return Promise.resolve(null)

        const token = await this.getAuthToken()
            
        const res = await axios.get(`https://${this.domain}.org/PXP2_CourseHistory.aspx?token=' + token + '&AGU=0`)
        const data = res.data

        const find = (start, end, startAt?) => {
            let toSearch = data.substring(startAt || 0);
            const startI = toSearch.indexOf(start) + start.length;
            toSearch = toSearch.substring(startI);

            let endI = toSearch.indexOf(end);

            return toSearch.substring(0, endI)
        }

        const unweighted = find('<span class="gpa-score">', '</span>')

        const weighted = find('<span class="gpa-score">', '</span>', data.indexOf('Weighted'))

        const courseHistory = JSON.parse(find('PXP.CourseHistory =', 'PXP.Translations.CourseHistory').trim());

        return {unweighted: unweighted, weighted: weighted, history: courseHistory.reverse()}
    },

    getDocuments() {
        if (!this.loggedIn)
            return Promise.resolve(null)

        return this.parseData(this.request('GetStudentDocumentInitialData'))
        .then((data) => (data.StudentDocuments.StudentDocumentDatas.StudentDocumentData).map(doc => doc._attributes))
    },

    getDoc(guid) {
        if (!this.loggedIn)
            return Promise.resolve(null)

        return this.parseData(this.request('GetContentOfAttachedDoc', { DocumentGU: guid }))
            .then(data => data.StudentAttachedDocumentData.DocumentDatas.DocumentData)
    },

    getReportCards() {
        if (!this.loggedIn)
            return Promise.resolve(null)

        this.parseData(this.request('GetReportCardInitialData'))
    }

}

export default Api;