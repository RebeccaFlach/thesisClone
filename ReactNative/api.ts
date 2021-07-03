import axios from "axios";
import xml2js from 'xml2js';
import convert from 'xml-js';

export default class Api {
    user:string;
    pass:string;

    constructor(user, pass) {
        this.user = user;
        this.pass = pass
    }

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
    }

    parseData(promise) {
        return promise.then((res) =>  {
            
            const response = convert.xml2js(res.data, {compact: true});

            console.log('-------response')
            console.log(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult)
            // console.log(response)
            const data = convert.xml2js(response['soap:Envelope']['soap:Body'].ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult._text
                , {compact: true}
            )

            console.log('--------data')
            console.log(data)
            return data;
        })
        
    }

    getMessages():Promise<any> {
        return this.parseData(this.request('GetPXPMessages')).then((messageData) => messageData.PXPMessagesData.MessageListings.MessageListing)
    }

}