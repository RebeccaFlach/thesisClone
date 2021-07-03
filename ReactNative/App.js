import 'react-native-gesture-handler';
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
import Login from './Pages/Login';

export default function App() {
  const Drawer = createDrawerNavigator();

  return  <NavigationContainer>
    <Drawer.Navigator>
      <Drawer.Screen name='Login' component={Login} 
        //https://reactnavigation.org/docs/headers
      />
      <Drawer.Screen name='Messages' component={Messages} />
      <Drawer.Screen name='History' component={History} />

      <Drawer.Screen name='Homepage' component={Homepage} 
       
        //https://reactnavigation.org/docs/headers
      
      />
      <Drawer.Screen name="Attendance" component={Attendance} />

    </Drawer.Navigator>
  </NavigationContainer>

}
