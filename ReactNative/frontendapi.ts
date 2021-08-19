import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { restArgs } from "underscore"

//error handler
const handleError = () => {

}

//requester
const request  = (method:string, params?) => {
    //request to backend
    let url = 'https://simplevue-backend.herokuapp.com/api/grade/';
    url += method;
    
    return axios.get(url, params).then((res) => {
        return {data: res.data, error: null};

    })
    .catch((err) => {
        AsyncStorage.getItem(method).then(data => {
            return {data: data, error: err}
        })
        return {data: null, error: err}

    })
    //.then
        //if success, store data and return {data: data, err: null}
    //err
        //use method as stored data key
}


//all methods (include handling parameters)
//or just call request(blah ) from files?

const api = {
    getMessages: () => request('messages'),
    getGrades: () => request('grades'),
    getStudentInfo: () => request('studentInfo'),
    getSchedule: () => request('schedule'),
    getHistory: () => request('history'),
    getDocuments: () => request('documents'),
    getDoc: (id:string) => request('document', {docID: id}),


    getNames: () => AsyncStorage.getItem('classNicknames').then(json => JSON.parse(json))
}


export default api;

export {}