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
        return <Text style={[GlobalStyles.text, {marginBottom: 40}]}>
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
            renderItem={({item}) => <Assignment assignment={item._attributes} />}
            keyExtractor={(item) => item._attributes.GradebookID}
        />
    </View>
}


const Assignment = (props: {assignment: AssignmentEntity}) => {

    console.log(props.assignment)
    const points = props.assignment.Points.split(' / ')

    const pointsEarned = parseFloat(points[0]).toFixed(2);
    const pointsPossible = parseFloat(points[1]).toFixed(2)

    return <View style={[GlobalStyles.section, styles.assignment, {minHeight: 50}]}>
        <Text style={[GlobalStyles.text, {fontSize: 20, flex: 1}]} numberOfLines={1}>{props.assignment.Measure}</Text>
        <Text style={[GlobalStyles.text]} >{pointsEarned} / {pointsPossible} </Text>
    </View>
}

const styles = StyleSheet.create({
    assignment: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
        

    }


})



export default ClassView;