import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import { createStackNavigator } from '@react-navigation/stack';

import GlobalStyles from './GlobalStyles';
import config from './config';
import { NavigationContainer } from '@react-navigation/native';

import {AssignmentEntity} from '../backend/src/model/GradeBook';

import ClassView from './Pages/ClassView'

import api from './api'

interface Grade {
  title: string,
  grade: string,
  letterGrade: string,
  assignments: AssignmentEntity[],
  teacher: string, 
  room: string,
}

const Homepage = ({ navigation }) => {
  

  const Stack = createStackNavigator()
 
  const parentNav = navigation;

  const Main = ({ navigation }) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [grades, setGrades] = React.useState<Grade[]>();

    React.useEffect(() => {api.getGrades().then(setGrades)}, []);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		api.getGrades().then((data) => {
			setGrades(data);
			setRefreshing(false)
		})
	}, []);

    return <View style={GlobalStyles.container}>
        <Header />
        <FlatList
          data={grades}
          renderItem={({item}) => <Grade
            nav={navigation}
            info={item}
            key={item.title}
          />}

          keyExtractor={(course) => course.title}
          style={styles.gradeList}

          refreshing={refreshing}
          onRefresh={onRefresh}
        />

    </View>
  	}

	return <Stack.Navigator headerMode={'none'}>
		<Stack.Screen component={Main} name="Main" />
		<Stack.Screen component={ClassView} name={'ClassView'}/>
	</Stack.Navigator>

}

const Grade = (props) => {
  const LetterGrade = () => {
    let color;
    switch(props.info.letterGrade){
      case 'A': 
        color = '#63ff00';
        break;
      case 'B':
        color = '#d6ff00';
        break;
      case 'C': 
        color = '#ffff00';
        break;
      case 'D':
        color = '#ffc100';
        break;
      default: 
        color = '#ff0000';
    }
    return <Text style = {{fontSize: 40, color: color}}>{props.info.letterGrade}</Text>
  }
  
  return <Pressable 
    onPress={() => {props.nav.navigate('ClassView', props.info)}} 
    style={[styles.courseSection, GlobalStyles.section]}
  >
    <LetterGrade />
    <Text style={[GlobalStyles.text, {fontSize: 20, marginLeft: 20, marginRight: 20, flex: 1} ]} 
      numberOfLines={1}
    >
      {props.info.title} 
    </Text> 
    <Text style={[GlobalStyles.text, {fontSize: 30}]} >{ props.info.grade } </Text>
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
    height: 90,
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
    padding: 20
  }
});

export default Homepage;
