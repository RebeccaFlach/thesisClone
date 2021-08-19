import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, SafeAreaView, Dimensions } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';

import GlobalStyles from './GlobalStyles';

import {AssignmentEntity} from '../backend/src/model/GradeBook';

import ClassView from './Pages/ClassView'
import SkeletonContent from 'react-native-skeleton-content';

import _ from 'underscore';

import Reusables from './Reusables';

import ErrorHandler from './ErrorHandler';

import api from './frontendapi';

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

	return <View style={{flex: 1, ...GlobalStyles.container}}>
		<NamesContext.Provider value={[names, saveName]} >
			<Stack.Navigator>
				<Stack.Screen component={Main} name="Main"  options={{
					headerShown: false
				}} />
				<Stack.Screen component={ClassView} name='ClassView'
					options={{
						...GlobalStyles.header,
						title: '' //filled by each page
					}}
				/>
			</Stack.Navigator>

		</NamesContext.Provider>
	</View>

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
		...styles.courseSection,  
		children: [
			{key: 'title', height: 60, width: '90%'},
		]
	}

	const height = Dimensions.get("window").height - 60;

    return <SafeAreaView style={[GlobalStyles.container]} >
		<ErrorHandler res={res} getFunc={getGrades} attempts={attempts}/>
		<Reusables.SkeletonLoader
			loading={loading}
			skeleton={Array(4).fill(courseSkeleton)}
		>
			<FlatList
				data={grades}
				renderItem={({item}) => <Grade
					nav={navigation}
					info={item}
					key={item.title}
					height={Math.floor(height/grades.length)}
				/>
				}

				keyExtractor={(course) => course.title}
				style={styles.gradeList}
				
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>
		</Reusables.SkeletonLoader>

    </SafeAreaView>
  	}


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
			case 'E': 
			case 'F':
				color = '#E41B1B';
				break;
			default: 
				color = '#808080';
		}
    return <Text style = {{fontSize: 40, color: color}}>
		{props.info.letterGrade}
	</Text>
	}
  	const [names, saveName] = React.useContext(NamesContext)
	const nickname = names[props.info.title]

	//manually do max/min height bcs weird bug
	let height = props.height
	height = _([height, 120]).min()
	height = _([height, 90]).max()
	

	return <Pressable 
		onPress={() => {props.nav.navigate('ClassView', {...props.info, nickName: props.nickName})}} 
		style={[styles.courseSection, GlobalStyles.section, { height: height,}]}
	>
	
		<LetterGrade />
		<Text 
			style={[GlobalStyles.text, {fontSize: 18, marginLeft: 20, marginRight: 15, flex: 1,} ]} 
			numberOfLines={1}
		>
			{nickname|| props.info.title} 
			
		</Text> 

		<Text style={[GlobalStyles.text, {fontSize: 28}]} >{ props.info.grade } </Text>


	</Pressable>
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
	padding: 20,

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
	height: '100%'
  }
});

export default Homepage;
export {NamesContext}
