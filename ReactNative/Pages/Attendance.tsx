import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, ScrollView } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

import textVersion from 'textversionjs'
import * as dayjs from 'dayjs'

import { Absence } from '../../backend/src/model/Attendance'

const Attendance = ({ navigation }) => {
    const [attendance, setAttendance] = React.useState<Absence[]>()
    const getAttendance= () => {
        // axios.get(gradeUrl + 'ping').then(console.log)
        // .catch(console.log)
    
        axios.get(config.url + 'attendance', config.axiosOpts)
          .then((res) => {
            console.log(res.data)
            setAttendance(res.data)
        })
    }

    React.useEffect(getAttendance, [])

    const renderDay = ({item}) => {
        return <AttendanceDay date={item.AbsenceDate} />
    }


    return <View style={GlobalStyles.container}>
        <Button
            title="X"
            onPress={() => navigation.toggleDrawer()}
        />
        <FlatList
            data={attendance}
            renderItem={renderDay}
            keyExtractor={(day) => day.AbsenceDate}
        />
        <Text>Attendance!</Text>
    </View>
}

const AttendanceDay = (props) => {
    

    return <Text style={GlobalStyles.text}> {props.date}</Text>
}

export default Attendance;