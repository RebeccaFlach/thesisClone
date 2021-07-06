import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import config from '../config';
import { NavigationContainer } from '@react-navigation/native';

import {AssignmentEntity} from '../../backend/src/model/GradeBook'

const ClassView = ({route, navigation}) => {
    const courseInfo = route.params;


    // console.log(courseInfo.assignments)
    const ClassDetails = () => {
        return <Text style={GlobalStyles.text}>
            <Text style={{fontSize: 30}}>{courseInfo.title}</Text>
            {'\n'}
            <Text style={{fontSize: 20}}>{courseInfo.teacher}</Text>

            {'\n'}
            <Text style={{fontSize: 20}}>Room: {courseInfo.room}</Text>

        </Text>
    }





    return <View style={[GlobalStyles.container, {padding: 20}]}>
    
        <ClassDetails />

        <FlatList
            data={courseInfo.assignments}
            renderItem={({item}) => <Assignment assigment={item._attributes} />}
            keyExtractor={(item) => item._attributes.measure}
        />
    </View>
}


const Assignment = (props: {assigment: AssignmentEntity}) => {

    console.log(props.assigment.Measure)
    return <View style={[GlobalStyles.section, {minHeight: 50}]}>
        <Text style={GlobalStyles.text}>{props.assigment.Measure}</Text>

    </View>
}



export default ClassView;