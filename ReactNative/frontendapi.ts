import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import Constants from 'expo-constants';

const { manifest } = Constants;


const devUrl = 'http://' + (manifest.debuggerHost || "localhost").split(`:`).shift().concat(`:5001`) + '/api/grade/'

const request  = async (method:string, params?) => {
    if(!api.user)
        await api.login()

    // let url = 'https://simplevue-backend.herokuapp.com/api/grade/';
    let url = devUrl + method;
    
    const auth = {
        username: api.user,
        password: api.pass
    }
    
    return axios.get(url, {params: params, auth: auth}).then((res) => {
        //need to store data
        return {data: res.data, error: null};

    })
    .catch((err) => {
        AsyncStorage.getItem(method).then(data => {
            return {data: data, error: err}
        })
        return {data: null, error: err}
    })
}


const api = {
    user: '',
    pass: '',
    domain: '',
    getMessages: () => request('messages'),
    getGrades: () => request('grades'),
    getStudentInfo: () => request('studentInfo'),
    getSchedule: () => request('schedule'),
    getHistory: () => request('history'),
    getDocuments: () => request('documents'),
    getDoc: (id:string) => request('document', {docID: id}),


    getNames: () => AsyncStorage.getItem('classNicknames').then(json => JSON.parse(json)),

    async login(){
        this.domain = await AsyncStorage.getItem('domain');
        this.pass = await SecureStore.getItemAsync('password');
        this.user = await SecureStore.getItemAsync('username');

        return this.user;
    },
    async checkLogin(user, pass) {
        this.domain = await AsyncStorage.getItem('domain');
    
        this.user = user;
        this.pass = pass;
        
        return request('messages');
    },

}


export default api;

export {}