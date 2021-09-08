import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, ScrollView, RefreshControl, SafeAreaView, Image } from 'react-native';
import GlobalStyles from '../GlobalStyles';


import api from '../frontendapi';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Reusables from '../Reusables';


interface ScheduleCourse {
    title: string,
    period: string,
    room: string,
    teacher: string,
    teacherEmail: string
}
const Schedule = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [res, setRes] = React.useState(null);
    const [attempts, setAttempts] = React.useState<number>(0);

    const schedule = res?.data;

    const getSchedule= () => {
		return api.getSchedule()
        .then((res) => {
			setRes(res);
			if (res.error)
				setAttempts(attempts + 1)
		})
    }
    const onRefresh = () => {
        setRefreshing(true);
        getSchedule().then(() => setRefreshing(false))
    }

    React.useEffect(() => {	
		getSchedule()
        .then(() => setLoading(false))
	}, []);

    return <SafeAreaView style={GlobalStyles.container}>
        <Reusables.SkeletonLoader
            loading={loading}

        >
            <Reusables.List
                data={schedule}
                itemRenderer={({item}) => <Course courseInfo={item} />}
                keyExtractor={item => item.title}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </Reusables.SkeletonLoader>

    </SafeAreaView>

}
const Course = (props: {courseInfo: ScheduleCourse}) => {
    const course = props.courseInfo;

    return <View style={[GlobalStyles.section, {flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 10}]}>
        <Text style={[GlobalStyles.text, {fontSize: 20}]}>{course.title}</Text>

        <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
            <MaterialCommunityIcons name="account" size={25} style={{opacity: 0.4}} /> {course.teacher}
        </Text>
        <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
            <MaterialCommunityIcons name="door-open" size={25} style={{opacity: 0.4}} /> {course.room}
        </Text>

    </View>
}
export default Schedule;