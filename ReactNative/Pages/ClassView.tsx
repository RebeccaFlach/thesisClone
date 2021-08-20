import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, SafeAreaView } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import config from '../config';
import { NavigationContainer } from '@react-navigation/native';

import {AssignmentEntity} from '../../backend/src/model/GradeBook'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NamesContext } from '../Homepage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'underscore';

const ClassView = ({route, navigation}) => {
    const courseInfo = route.params;
    const [names, saveName] = React.useContext(NamesContext);
    

    const ClassDetails = () => {
        const nickname = names && names[courseInfo.title]
        const title = nickname || courseInfo.title;
        const secondaryName = nickname ? courseInfo.title : '';

        React.useEffect(() => {
            navigation.setOptions({
                title: title,
                headerTransparent: false
            })
        }, [title])

        const [newName, setNewName] = React.useState<string>(title);
        const [editing, setEditing] = React.useState<boolean>(false);

        const saveNewName = () => {
            saveName(courseInfo.title, newName)
            setEditing(false)
        }
        
        const name = <Text style={[GlobalStyles.text, {fontSize: 25, marginRight: 10, flex: 1, flexWrap: 'wrap', flexDirection: 'row'}]}>
            {title}
        </Text>


        const editingName = <>
            <TextInput 
                style={[GlobalStyles.text, styles.input]} 
                onChangeText={setNewName} 
                autoFocus
                onSubmitEditing={saveNewName}
                placeholder='New name'
                placeholderTextColor={GlobalStyles.secondaryText.color}
                returnKeyType='done'
                onBlur={() => {setEditing(false)}}
                value={newName}
            />
        </>

        return <View style={[{marginBottom: 20, padding: 20}, GlobalStyles.section]}>
                
            <View style={[ {flex: 1, justifyContent: 'space-between', flexDirection: 'row', maxWidth: '100%', }]}>
                {editing? editingName : name}

                <Icon 
                    name={editing ? 'check' : 'pencil'} 
                    size={30} 
                    onPress={() => {
                        editing ? saveNewName() : setEditing(true)
                        
                    }} 
                    color='rgb(10, 132, 255)'
                />
            </View>

            <Text style={[GlobalStyles.secondaryText, {fontSize: 15, marginBottom: 10}]}>
                {secondaryName}
            </Text>

            <Text style={[GlobalStyles.secondaryText, {fontSize: 20, flex: 1}]}>
                <MaterialCommunityIcons name="account" size={25} style={{opacity: 0.4}} /> {courseInfo.teacher}
            </Text>


            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                <MaterialCommunityIcons name="door-open" size={25} style={{opacity: 0.4}} /> {courseInfo.room}
            </Text>
        </View>
    }
//should do sort by most points and by category




    return <SafeAreaView style={[GlobalStyles.container ]}>
        <FlatList
            keyboardShouldPersistTaps='handled'
            data={courseInfo.assignments}
            renderItem={({item}) => <Assignment assignment={item} />}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ClassDetails}
        />
    </SafeAreaView>
}


const Assignment = (props: {assignment}) => {
    if (!props.assignment || !props.assignment.points || !props.assignment.name)
        return <View></View>

    const points = props.assignment.points?.split(' / ');

    const pointsEarned = parseFloat(points[0]);
    const pointsPossible = parseFloat(points[1]);

    //parsing removes trailing 0s
    let writtenScore = parseFloat(pointsEarned.toFixed(1)) + ' / ' + parseFloat(pointsPossible.toFixed(1));
    if (isNaN(pointsEarned) || isNaN(pointsPossible))
        writtenScore = props.assignment.points

    let score = parseFloat(((pointsEarned / pointsPossible) * 100).toFixed(1)) as any;
    if (pointsPossible === 0 && pointsEarned > 0)
        score = 'EC'
    else if(isNaN(score))
        score = 'N/A';
    else
        score += '%';

    

    


    return <View style={[GlobalStyles.section, styles.assignment]}>
        {/* <Text style={[GlobalStyles.text, {flex: 1}]}> */}
        
        <Text style={[{fontSize: 15, flex: 1, marginRight: 20}, GlobalStyles.text]} numberOfLines={2}>
            {props.assignment.name} 
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


    },
    input: {
        width: 200, 
        height: 40, 
        borderBottomColor: 'white', 
        borderBottomWidth: 1
    }


})



export default ClassView;