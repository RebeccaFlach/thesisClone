import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import config from '../config';
import { NavigationContainer } from '@react-navigation/native';

import {AssignmentEntity} from '../../backend/src/model/GradeBook'

const ClassView = ({route, navigation}) => {
    const method = 'GetPXPMessages';
    const user = '1301246779';
    const pass = '3.1415fuckyou'
    // axios.post('https://student.tusd1.org/Service/PXPCommunication.asmx', 
    // `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/"><userID>${user}</userID><password>${pass}</password><skipLoginLog>1</skipLoginLog><parent>0</parent><webServiceHandleName>PXPWebServices</webServiceHandleName><methodName>${method}</methodName><paramStr>&lt;Parms&gt;&lt;ChildIntID&gt;0&lt;/ChildIntID&gt;&lt;/Parms&gt;</paramStr></ProcessWebServiceRequest></soap:Body></soap:Envelope>`,
    // {headers:{
    //     'Content-Type': 'text/xml; charset=utf-8',
    //     SOAPAction: 'http://edupoint.com/webservices/ProcessWebServiceRequest'
    //     }
    // }, 
    // ).then((res) => {console.log(res.data)})
    // .catch((err) => {console.log(err)})

    // console.log(route.params.assignments)
    return <Text>{route.params.title}</Text>
}

export default ClassView;