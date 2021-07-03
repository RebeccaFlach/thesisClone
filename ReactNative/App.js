import 'react-native-gesture-handler';
import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

//nav
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//screens
import Homepage from './Homepage';
import Messages from './Pages/Messages';
import Attendance from './Pages/Attendance';
import History from './Pages/History';
import Login from './Pages/Login';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  const Tabs = createBottomTabNavigator();

  return  <NavigationContainer>
    <Tabs.Navigator 
      tabBarOptions={{
        style: {
          backgroundColor: '#40454f'
        }
      }}
    >
      <Tabs.Screen name='Login' component={Login} 
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
  </NavigationContainer>

}
