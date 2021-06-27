import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import GlobalStyles from './GlobalStyles';
import config from './config';

interface Grade {
  title: string,
  grade: string,
  letterGrade: string
}

const Homepage = ({ navigation }) => {
  const [grades, setGrades] = React.useState<Grade[]>();

  const getGrades = () => {
    axios.get(config.url + 'grades/5', config.axiosOpts)
      .then((res) => {
        console.log(res)
        setGrades(res.data)
    })
  }
  React.useEffect(getGrades, []);

 
  return (
    <View style={GlobalStyles.container}>
      <Header />
      <Button
        title="X"
        onPress={() => navigation.toggleDrawer()}
      />
      <FlatList
        data={grades}
        renderItem={({item}) => <Grade
          key={item.title} 
          title={item.title} 
          grade={item.grade} 
          letterGrade={item.letterGrade}
        />}

        style={styles.gradeList}
      />

    </View>


  )
}

const Grade = (props) => {
  const LetterGrade = () => {
    let color;
    switch(props.letterGrade){
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
    return <Text style = {{fontSize: 40, color: color}}>{props.letterGrade}</Text>
  }
  
  return <View style={[styles.courseSection, GlobalStyles.section]}>
    <LetterGrade />
    <Text style={[GlobalStyles.text, {fontSize: 20, marginLeft: 20, marginRight: 20} ]} numberOfLines={1}> {props.title} </Text> 
    <Text style={[GlobalStyles.text, {fontSize: 30}]} >{ props.grade } </Text>
   
  </View>
}

const Header = () => {
  return (<View style={styles.header}>
    <Menu style={{backgroundColor: 'white'}}>
      <Text> hi</Text>
      <Text> test</Text>
    </Menu>

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
    display: 'flex',
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
