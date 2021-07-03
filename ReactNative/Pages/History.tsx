import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, ScrollView } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

import textVersion from 'textversionjs'
import * as dayjs from 'dayjs'

import GradeYear, { GradedTerm, GradedCourse } from '../../backend/src/model/History'

const History = ({ navigation }) => {
    const [history, setHistory] = React.useState<GradeYear[]>()
    const getHistory= () => {
        axios.get(config.url + 'history', config.axiosOpts)
          .then((res) => {
            console.log(res.data)
            setHistory(res.data)
        })
    }

    React.useEffect(getHistory, [])

    return <View style={GlobalStyles.container}>
        <Button
            title="X"
            onPress={() => navigation.toggleDrawer()}
        />
        <FlatList
            data={history}
            renderItem={({item}) => <Year name={item.Grade} terms={item.Terms} />}
            keyExtractor={(year) => year.Grade}
        />
    </View>
}


const Year = (props: {name:string, terms: GradedTerm[]}) => {
    return ( <View style={[GlobalStyles.section, {padding: 20}]}>
        <Text style={[GlobalStyles.text, {fontSize: 35}]}>{props.name}</Text>

        {props.terms.map((term,idx) => <Term name={term.TermName} courses={term.Courses} key={idx} />)}
    </View>

    )
}

const Term = (props: {name: string, courses: GradedCourse[]}) => {
    return <View style={[{margin: 10}]}>

        <View style={styles.term}>

            <Text style={[GlobalStyles.text, {fontSize: 25, textDecorationLine: 'underline', margin: 20, textAlign: 'center'}]}>{props.name}{'\n'}</Text>

            {props.courses.map((course, idx) => (
                <Text style={[GlobalStyles.text, styles.grade]} key={idx}> 
                    <Text>{course.CourseTitle} </Text>
                    <Text>{course.Mark + '\n'}</Text>
                </Text>) 
            )}

            <Text style={[GlobalStyles.text, {margin: 20, textAlign: 'right'}]}>
                View report card {'->'} 
            </Text>

        </View>
    </View>
}

const styles = StyleSheet.create({
    term: {
        // borderWidth: 1,
        // borderColor: '#666666',
        padding: 5, 
        backgroundColor: '#202226',
        borderRadius: 20
    },
    grade: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontSize: 20,
        margin: 10
    }


})

export default History;