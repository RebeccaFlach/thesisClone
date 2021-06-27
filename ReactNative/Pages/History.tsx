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
        // axios.get(gradeUrl + 'ping').then(console.log)
        // .catch(console.log)
    
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
    return <Text style={GlobalStyles.text}>
        <Text style={{fontSize: 25}}>{props.name}{'\n'}</Text>
        {props.courses.map((course) => course.CourseTitle + '   ' + course.Mark + '\n')}
    </Text>
}

const styles = StyleSheet.create({
    h2: {
        fontSize: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#666666'
    }

})

export default History;