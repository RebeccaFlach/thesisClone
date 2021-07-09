import 'react-native-gesture-handler';
import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, StatusBar } from 'react-native';

//nav
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';

//screens
import Homepage from './Homepage';
import Messages from './Pages/Messages';
import Attendance from './Pages/Attendance';
import History from './Pages/History';
import Login from './Pages/Login';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyles from './GlobalStyles';
import api from './api';

export default function App() {
  const Tabs = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = React.useState(false)

  const login = (domain, name, pass) => {
    api.login(domain, name, pass)
    setLoggedIn(true)
  }


  //fucking hate this. works for now for basic testing without breaking everything
  const Test = () => {
    return <Login login={login} />
  }
  React.useEffect(() => {setLoggedIn(false)}, [])

  return  <NavigationContainer >
    <StatusBar barStyle='light-content'></StatusBar>
    <View style={[{height: 22, backgroundColor: '#282c34',}, GlobalStyles.section]}></View>



    {!loggedIn ? <Login login={login}/> :
    <Tabs.Navigator 
      tabBarOptions={{
        style: {
          backgroundColor: '#40454f'
        }
      }}
    >
      
      <Tabs.Screen name='Login' component={Test} 
        //https://reactnavigation.org/docs/headers
      />
      
      <Tabs.Screen name='Messages' component={Messages}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="email" color={color} size={size} />
          )
        }}
      />

      <Tabs.Screen name='History' component={History} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='book-account' color={color} size={size} />
          )
        }}
      />

      <Tabs.Screen name='Homepage' component={Homepage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          )
        }}
      />

      <Tabs.Screen name="Attendance" component={Attendance} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-check" color={color} size={size} />
          ) 
        }}
      />

    </Tabs.Navigator>
}
  </NavigationContainer>

}
