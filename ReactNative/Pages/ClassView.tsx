import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import config from '../config';
import { NavigationContainer } from '@react-navigation/native';

import {AssignmentEntity} from '../../backend/src/model/GradeBook'

const ClassView = ({route, navigation}) => {
    const courseInfo = route.params;

    const ClassDetails = () => {
        return <Text style={[GlobalStyles.text, {marginBottom: 40, padding: 20}]}>
            <Text style={{fontSize: 30}}>{courseInfo.title}</Text>
            {'\n'}
            <Text style={{fontSize: 20, color: '#d0d0d0'}}>{courseInfo.teacher}</Text>

            {'\n'}
            <Text style={{fontSize: 20, color: '#d0d0d0'}}>Room: {courseInfo.room}</Text>

        </Text>
    }
//should do sort by most points




    return <View style={[GlobalStyles.container ]}>
        <FlatList
            data={courseInfo.assignments}
            renderItem={({item}) => <Assignment assignment={item._attributes} />}
            keyExtractor={(item) => item._attributes.GradebookID}
            ListHeaderComponent={ClassDetails}
        />
    </View>
}


const Assignment = (props: {assignment: AssignmentEntity}) => {

    const points = props.assignment.Points.split(' / ')

    const pointsEarned = parseFloat(points[0]);
    const pointsPossible = parseFloat(points[1]);

    //parsing removes trailing 0s
    let writtenScore = parseFloat(pointsEarned.toFixed(1)) + ' / ' + parseFloat(pointsPossible.toFixed(1));
    if (isNaN(pointsEarned) || isNaN(pointsPossible))
        writtenScore = props.assignment.Points

    let score = parseFloat(((pointsEarned / pointsPossible) * 100).toFixed(1)) as any;
    if (pointsPossible === 0 && pointsEarned > 0)
        score = 'EC'
    else if(isNaN(score))
        score = 'N/A';
    else
        score += '%';

    

    


    return <View style={[GlobalStyles.section, styles.assignment]}>
        {/* <Text style={[GlobalStyles.text, {flex: 1}]}> */}
        
        <Text style={[{fontSize: 15, flex: 1,}, GlobalStyles.text]} numberOfLines={2}>
            {props.assignment.Measure} 
        </Text>
        <Text style={[GlobalStyles.text, {fontSize: 20}]} >
            {score}
        </Text>
        <Text style={[ {width: '100%', color: '#d0d0d0'}]}>
            {writtenScore}
        </Text>
    </View>
}

const styles = StyleSheet.create({
    assignment: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 60,
        flexWrap: 'wrap',
        padding: 15,
        

    }


})



export default ClassView;