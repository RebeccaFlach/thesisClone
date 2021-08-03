import axios, { AxiosResponse } from "axios";
import xml2js from 'xml2js';
import convert from 'xml-js';

import React from "react";

import _ from 'underscore'

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const Api = {
    user: '',
    pass: '',
    domain: '',

    async login() {
        this.domain = await AsyncStorage.getItem('domain');
        this.pass = await SecureStore.getItemAsync('password');
        this.user = await SecureStore.getItemAsync('username');

        return this.user;
    },

    async request(method:string, params={}) {
        // console.log('user ' +  this.user)
        // console.log('pass ' + this.pass)
        // console.log('domain ' + this.domain)
        if(!this.user)
            await this.login()
            // &lt;Parms&gt;&lt;MessageListing xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"           IconURL="images/PXP/TchComment_S.gif"    ID="31E9E442-7087-4DF3-AF2B-51B596D3F3E9"    BeginDate="08/07/2020 16:02:00"    Type="StudentActivity"    Deletable="true"    Read="true"    From="Sarah Stuart"    MarkAsRead="true"    &gt;&lt;/MessageListing&gt;&lt;/Parms&gt; 


        let paramStr = '&lt;Parms&gt;';
        Object.entries(params).forEach(([key, value]) => {
            paramStr += '&lt;' + key + '&gt;';
            paramStr += value;
            paramStr += '&lt;/' + key + '&gt;';
        });
        paramStr += '&lt;/Parms&gt;';

        //<key>value</key>
        
        if (method === 'UpdatePXPMessage'){
            paramStr = `&lt;Parms&gt;&lt;MessageListing xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"          ID="31E9E442-7087-4DF3-AF2B-51B596D3F3E9"    Type="StudentActivity"  MarkAsRead="true"  
              &gt;&lt;/MessageListing&gt;&lt;/Parms&gt;`
        }

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
        )
    },

    parseData(promise) {
        return promise.then((res) =>  {
            const response = convert.xml2js(res.data, {compact: true});

            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            ) as any;

            if (data.RT_ERROR)
                return Promise.reject(data.RT_ERROR._attributes.ERROR_MESSAGE)

            return data;
        })
        .catch((err) => {return Promise.reject(err)})
        
    },

    async getMessages():Promise<any> {
        return this.parseData(this.request('GetPXPMessages'))
            .then((messageData) => {
                // console.log(messageData)
                const messages = messageData?.PXPMessagesData.MessageListings.MessageListing;
                AsyncStorage.setItem('messages', JSON.stringify(messages));
                return {data: messages, error: null};
            })
            .catch((err) => {
                return AsyncStorage.getItem('messages').then((data) => {
                    return {error: err, data: JSON.parse(data)}
                })
                .catch(err => {return {error: err, data: null}})
            })
    },

    async markRead() {
        const params = `MessageListing xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"           IconURL=\"images/PXP/TchComment_S.gif\"    ID=\"31E9E442-7087-4DF3-AF2B-51B596D3F3E9\"    BeginDate=\"08/07/2020 16:02:00\"    Type=\"StudentActivity\"    Deletable=\"true\"    Read=\"true\"    From=\"Sarah Stuart\"    MarkAsRead=\"false\"`

        this.request('UpdatePXPMessage', {[params] : ''}).then(console.log).catch(console.log)
    },

    getGrades() {
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
                        assignments: _(course.Marks.Mark.Assignments.Assignment).map((a) => {
                            return {
                            name: a._attributes.Measure,
                            id: a._attributes.GradebookID,
                            points: a._attributes.Points,
                        }})

                    }
                });

                this.storeData('grades', summary)

                return {error: null, data: summary};
            }).catch((err) => {
                return AsyncStorage.getItem('grades').then((data) => {
                    return {error: err, data: JSON.parse(data)}
                })
                .catch(err => {return {error: err, data: null}})
            })

            //catch- return this.getitem(grades)
    },

    getAuthToken() {
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
        const token = await this.getAuthToken();

        let res:AxiosResponse<any>;
        let data;
        try {
            res = await axios.get(`${this.domain}/PXP2_CourseHistory.aspx?token=${token}&AGU=0`)
            if (res.status != 200)
                return Promise.reject(res)
            
        }
        catch (err) {
            return Promise.reject(err);
        }
        
        data = res.data;

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

        const courseHistory = JSON.parse(find('PXP.CourseHistory =', 'PXP.Translations.CourseHistory').trim());

        return {unweighted: unweighted, weighted: weighted, history: courseHistory.reverse()}
    },

    getDocuments() {
        return this.parseData(this.request('GetStudentDocumentInitialData'))
        .then((data) => (data.StudentDocuments.StudentDocumentDatas.StudentDocumentData).map(doc => doc._attributes))
    },

    getDoc(guid) {
        return this.parseData(this.request('GetContentOfAttachedDoc', { DocumentGU: guid }))
            .then(data => {return data.StudentAttachedDocumentData.DocumentDatas.DocumentData})
    },

    getReportCards() {
        this.parseData(this.request('GetReportCardInitialData'))
    },

    async getStudentInfo() {
        const info = await this.parseData(this.request('StudentInfo'))
        // console.log(info);
        return info.StudentInfo;
    },

    async getStudentHealth() {
        const params = {
            ChildIntID: 0, 
            HealthConditions: false,
            HealthVisits: false,
            HealthImmunizations: true
        }
        this.parseData(this.request('StudentHealthInfo', params)).then(console.log)
    },




    getErrorMessage(error:string) {
        // console.log(error);

        return error;
    },




    async storeData(key, value) {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value))
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

    getDistricts(zip) {
        const zipLookupKey = '5E4B7859-B805-474B-A833-FDB15D205D40' //got this from somewhere that said "idk how safe this is" so yeah

        const getter = axios.post('https://support.edupoint.com/Service/HDInfoCommunication.asmx',
        `<?xml version="1.0" encoding="utf-8"?>\n
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                        <webServiceHandleName>HDInfoServices</webServiceHandleName>
                        <methodName>GetMatchingDistrictList</methodName>
                        <paramStr>
                            &lt;Parms&gt;&lt;Key&gt;${zipLookupKey}&lt;/Key&gt;&lt;MatchToDistrictZipCode&gt;${zip}&lt;/MatchToDistrictZipCode&gt;&lt;/Parms&gt;
                        </paramStr>
                    </ProcessWebServiceRequest>
                </soap:Body>
            </soap:Envelope>`,
        {headers:{
            'Content-Type': 'text/xml; charset=utf-8',
           
            }
        }, 
        )

        return this.parseData(getter).then((data) =>  data.DistrictLists.DistrictInfos.DistrictInfo.map(district => district._attributes) )
        
    },

    async checkLogin(user, pass) {
        this.domain = await AsyncStorage.getItem('domain');
        // console.log(this.domain)
        this.user = user;
        this.pass = pass;
        
        // return this.getAuthToken().then((res) => {
        //     return '';
        // })
        // .catch((err) => err)
        return Promise.resolve('')
    }



}

export default Api;