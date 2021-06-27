import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

//nav
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

//screens
import Homepage from './Homepage';
import Messages from './Pages/Messages';
import Attendance from './Pages/Attendance';
import History from './Pages/History';

export default function App() {
  const [grades, setGrades] = React.useState([]);
  const [gradePeriod, setGradePeriod] = React.useState(0)
  const [loggedIn, setLoggedIn] = React.useState();


  const axiosConfig = {withCredentials: true}
  const gradeUrl ='https://mren-na1-localhost.io:6001/api/grade/';

  const Login = ({navigation}) => {
    const [name, setName] = React.useState();
    const [pass, setPass] = React.useState();

    const login = () => {
      axios.get(gradeUrl + 'login/' + name + '/' + pass, axiosConfig).then(
        () => {
          setLoggedIn(true);
          console.log('logged in')
        }
  
      )
    }
    return (<View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button
        title="X"
        onPress={() => navigation.toggleDrawer()}
      />
        <TextInput 
          onChangeText={(e) => setName(e)} 
          style={styles.input}
        />
        <TextInput 
          onChangeText={setPass} 
          style={styles.input}
        />

      <Button onPress={login} title='login' />

      <StatusBar style="auto" />
    </View>
  );
  }

  const TestPage = () => {
    return <Text>Hello World!</Text>
  }
  
  const Stack = createStackNavigator();

  const Drawer = createDrawerNavigator();

  return  <NavigationContainer>
    {/* <Button onPress={()=> {navigation.toggleDrawer()}} title='X' /> */}
    <Drawer.Navigator>
      <Stack.Screen name='Login' component={Login} 
        options={{
          headerStyle: {height: 0}
        }}
        //https://reactnavigation.org/docs/headers
      

      />
      <Drawer.Screen name='Messages' component={Messages} />
      <Drawer.Screen name='History' component={History} />

      <Drawer.Screen name='Homepage' component={Homepage} 
       
        //https://reactnavigation.org/docs/headers
      
      />
      <Drawer.Screen name="Attendance" component={Attendance} />
      <Drawer.Screen name='TestPage' component={TestPage} />

    </Drawer.Navigator>
  </NavigationContainer>

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282c34',
    color: '#eeeeee',
    height: '100%',
    // padding: 20,
  },
  input: {
    height: 40,
    width: 100,
    borderWidth: 2
  }
});
