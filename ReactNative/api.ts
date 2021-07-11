import axios from "axios";
import xml2js from 'xml2js';
import convert from 'xml-js';

import React from "react";

import _ from 'underscore'

import AsyncStorage from '@react-native-async-storage/async-storage';

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

        return axios.post(`https://student.tusd1.org/Service/PXPCommunication.asmx`,
            `<?xml version="1.0" encoding="utf-8"?>\n
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                        <userID>1301246779</userID>
                        <password>3.1415fuckyou</password>
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

            // console.log(res)
            const response = convert.xml2js(res.data, {compact: true});

            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            )

            console.log('output')
            // console.log(data)
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
            
        const res = await axios.get(`https://${this.domain}/PXP2_CourseHistory.aspx?token=' + token + '&AGU=0`)
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
    },

    async storeData(value) {
        try {
          await AsyncStorage.setItem('testing', value)
        } catch (e) {
          console.log('error')
          console.log(e)
        }
    },
    async getData() {
        try {
          const val = await AsyncStorage.getItem('testing')
          return val
        } catch(e) {
          // error reading value
        }
    },

    async getNames() {
        try {
            const names = await AsyncStorage.getItem('classNicknames')
            return JSON.parse(names)
        } catch(e) {
            console.log(e)
        }
    },

    async setName(officialName, newName) {
        const names = await this.getNames() || {};
        _(names).extend({[officialName]: newName})

        // console.log(names)
        try {
            return await AsyncStorage.setItem('classNicknames', JSON.stringify(names))
        }
        catch(e) {
            console.log(e)
        }
    },

    useNames(){
        const [names, setNames] = React.useState(null);

        return [names, setNames];
    },

}

export default Api;