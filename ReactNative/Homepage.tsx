import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, SafeAreaView } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';

import GlobalStyles from './GlobalStyles';
import config from './config';
import { NavigationContainer } from '@react-navigation/native';

import {AssignmentEntity} from '../backend/src/model/GradeBook';

import ClassView from './Pages/ClassView'

import api from './api'
import SkeletonContent from 'react-native-skeleton-content';

import _ from 'underscore';


import ErrorHandler from './ErrorHandler';

interface Grade {
  title: string,
  grade: string,
  letterGrade: string,
  assignments: AssignmentEntity[],
  teacher: string, 
  room: string,
}
const NamesContext = React.createContext([])

const Homepage = ({ navigation }) => {
	const Stack = createStackNavigator()
	const [names, setNames] = React.useState<any>({});


	React.useEffect(() => {	

		api.getNames().then((data) => {
			setNames(data || {})
		}
	)}, []);

	const saveName = (officialName, newName) => {
		const newNames = _(names).clone()
		_(newNames).extend({[officialName]: newName})

		setNames(newNames)
		AsyncStorage.setItem('classNicknames', JSON.stringify(newNames))
	}

	return <NamesContext.Provider value={[names, saveName]}>
		<Stack.Navigator headerMode={'none'}>
			<Stack.Screen component={Main} name="Main" />
			<Stack.Screen component={ClassView} name={'ClassView'}/>
		</Stack.Navigator>
	</NamesContext.Provider>

}

const Main = ({ navigation }) => {

	const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
	const [attempts, setAttempts] = React.useState<number>(0);

	const [res, setRes] = React.useState(null);
	const grades:Grade[] = res?.data;

	const getGrades = () => {
		return api.getGrades().then((res) => {
			setRes(res);

			if (res.error)
				setAttempts(attempts + 1)
		})
		
	}



    React.useEffect(() => {	
		getGrades().then(() => setLoading(false))
	}, []);



	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getGrades().then(() => setRefreshing(false))
	}, []);

	const courseSkeleton = {
		...styles.courseSection, margin: 15, children: [
			{key: 'letterGrade', width: 45, height: 45},
			{key: 'title', height: 30, width: '50%'},
			{key: 'numberGrade', height: 30, width: 40}
		]
	}

	


    return <SafeAreaView style={GlobalStyles.container}>
		{/* <FlashMessage ref={pageRef} autoHide={false}/> */}
		<ErrorHandler res={res} getFunc={getGrades} attempts={attempts}/>
		<SkeletonContent
			isLoading={loading}
			boneColor="#121212"
			highlightColor="#333333"
			containerStyle={{width: '100%', flex: 1}}
			layout={Array(4).fill(courseSkeleton)}
		>
			<FlatList
				data={grades}
				renderItem={({item}) => <Grade
					nav={navigation}
					info={item}
					key={item.title}
				/>
			}

				keyExtractor={(course) => course.title}
				style={styles.gradeList}
				
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>
		</SkeletonContent>

    </SafeAreaView>
  	}

	  //Es instead of F's fucking hell why

const Grade = (props) => {

	const LetterGrade = () => {
		let color;
		switch(props.info.letterGrade){
			case 'A': 
			color = '#3B9900';
			break;
			case 'B':
			color = '#80B90E';
			break;
			case 'C': 
			color = '#EDC812';
			break;
			case 'D':
			color = '#ED9212';
			break;
			default: 
			color = '#E41B1B';
		}
    return <Text style = {{fontSize: 40, color: color}}>
		{props.info.letterGrade}
	</Text>
	}
  	const [names, saveName] = React.useContext(NamesContext)
	const nickname = names[props.info.title]

	return <View >
	<Pressable 
		onPress={() => {props.nav.navigate('ClassView', {...props.info, nickName: props.nickName})}} 
		style={[styles.courseSection, GlobalStyles.section]}
	>
	
		<LetterGrade />
		<Text 
			style={[GlobalStyles.text, {fontSize: 20, marginLeft: 20, marginRight: 20, flex: 1,} ]} 
			numberOfLines={1}
		>
			{nickname|| props.info.title} 
			
		</Text> 

		<Text style={[GlobalStyles.text, {fontSize: 30}]} >{ props.info.grade } </Text>


	</Pressable>
{/* 
	<TextInput style={{width: 100, height: 40, borderColor: 'white', borderWidth: 2}} onChangeText={setNewName}></TextInput>
  	<Button title='save' onPress={saveNewName}/> */}
</View>
}

const Header = () => {
  return (<View style={styles.header}>

    <Text style={{color: '#f0f0f0', fontSize: 30}}>Quarter 3</Text>
  </View>)
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282c34',
    color: '#eeeeee',
    height: '100%',
  },
  courseSection : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
	padding: 20
  },
  header: {
    height: '10%',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeList: {
    padding: 0,
	// height: '100%'
  }
});

export default Homepage;
export {NamesContext}
