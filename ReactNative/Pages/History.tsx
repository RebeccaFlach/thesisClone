import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, ScrollView } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

import textVersion from 'textversionjs'
import * as dayjs from 'dayjs';

import api from '../api'

import GradeYear, { GradedTerm, GradedCourse } from '../../backend/src/model/History'

const History = ({ navigation }) => {
    const [history, setHistory] = React.useState<GradeYear[]>();
    const [refreshing, setRefreshing] = React.useState(false);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        api.getHistory().then((data) => {
            setHistory(data);
            setRefreshing(false)
        })
    }, []);

    React.useEffect(() => {api.getHistory().then(setHistory)}, [])

    return <View style={GlobalStyles.container}>
        <FlatList
            data={history}
            renderItem={({item}) => <Year name={item.Grade} terms={item.Terms} />}
            keyExtractor={(year) => year.Grade}

            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    </View>
}


const Year = (props: {name:string, terms: GradedTerm[]}) => {
    return ( <View style={[GlobalStyles.section, {padding: 10}]}>
        <Text style={[GlobalStyles.text, {fontSize: 35}]}>{props.name}</Text>

        {props.terms.map((term,idx) => <Term name={term.TermName} courses={term.Courses} key={idx} />)}
    </View>

    )
}

const Term = (props: {name: string, courses: GradedCourse[]}) => {
    return <View style={styles.term}>

        <Text style={[GlobalStyles.text, {fontSize: 25, textDecorationLine: 'underline', textAlign: 'center'}]}>{props.name}{'\n'}</Text>

        {props.courses.map((course, idx) => (
            <View style={[ styles.grade]} key={idx}> 
                <Text 
                    style={[{flex: 1, fontSize: 20, marginRight: 10}, GlobalStyles.text]} 
                    numberOfLines={1}
                >
                    {course.CourseTitle} 
                </Text>
                <Text style={[{fontSize: 30}, GlobalStyles.text]}>
                    {course.Mark}
                </Text>
            </View>) 
        )}

        <Text style={[GlobalStyles.text, {margin: 20, textAlign: 'right'}]}>
            View report card {'->'} 
        </Text>

    </View>
}

const styles = StyleSheet.create({
    term: {
        padding: 15, 
        backgroundColor: '#202226',
        borderRadius: 20,
        marginBottom: 10
    },
    grade: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        maxHeight: 35,
        fontSize: 20,
    }


})

export default History;