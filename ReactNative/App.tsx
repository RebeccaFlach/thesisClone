import 'react-native-gesture-handler';
import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, StatusBar, SafeAreaView, KeyboardAvoidingView } from 'react-native';

//nav
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//screens
import Homepage from './Homepage';
import Messages from './Pages/Messages';
import History from './Pages/History';
import {EnterZip, DistrictList} from './Pages/Login';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyles from './GlobalStyles';
import api from './api';
import * as SecureStore from 'expo-secure-store';
import StudentInfo from './Pages/Student';

export default function App() {
  const Tabs = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = React.useState(false)

  	React.useEffect(() => {
		api.login().then((user) => {
			// setLoggedIn(false)
			if (!user)
				setLoggedIn(false)
			else
				setLoggedIn(true);
		})
    
	}, [])

	const Login = () => {
		const [name, setName] = React.useState<string>();
		const [pass, setPass] = React.useState<string>();
		const [error, setError] = React.useState<string>();
	
		const setInfo = async () => {
			const res = await api.checkLogin(name, pass);
			if (res){
				console.log('setting err')
				console.log(JSON.stringify(res))
				setError(JSON.stringify(res));
			}
			else {
				const passPromise = SecureStore.setItemAsync('password', pass);
				const userPromise = SecureStore.setItemAsync('username', name);

				await Promise.all([passPromise, userPromise]);
				await api.login();
				console.log('logged in!')
				setLoggedIn(true);
			}
			
		}
	
		return (<SafeAreaView style={GlobalStyles.container}>
			
			<KeyboardAvoidingView style={styles.login} >
				<Text style={{color: '#c21f13', fontSize: 15}}>{error}</Text>
				<TextInput 
					placeholder='Username'
					placeholderTextColor='#b0b0b0'
					onChangeText={setName} 
					style={[styles.input]}
					autoCompleteType='username'
					textContentType='username'
				/>
			
				<TextInput 
					placeholder='Password'
					placeholderTextColor='#b0b0b0'
					onChangeText={setPass} 
					style={[styles.input]}
					autoCompleteType='password'
					textContentType='password'
					secureTextEntry
				/>
	
				<Button onPress={setInfo}title='login' />
			</KeyboardAvoidingView>
		</SafeAreaView>
	  );
	}

	const SignUp = () => {
		const Stack = createStackNavigator();
	
		return <Stack.Navigator headerMode='none'>
			<Stack.Screen 
				component={EnterZip}
				name='EnterZip'
			/>
			<Stack.Screen
				component={DistrictList}
				name='DistrictList'
			/>
			<Stack.Screen
				component={Login}
				name='Login'
			/>
		</Stack.Navigator>
	}


	return <NavigationContainer >
    <StatusBar barStyle='light-content'></StatusBar>


    {!loggedIn 
	? <SignUp />
	:
    <Tabs.Navigator 
      tabBarOptions={{
		labelPosition: 'below-icon',
        style: {
			backgroundColor: '#121219',
			height: 50
        }
      }}
	  
    >

		<Tabs.Screen name='Grades' component={Homepage} 

			options={{
				
				
			tabBarIcon: ({ color, size }) => (
				<MaterialCommunityIcons name="home" color={color} size={size } />
			),
	
			}}
      	/>
      
		<Tabs.Screen name='Messages' component={Messages}
			options={{
				
			tabBarIcon: ({ color, size }) => (
				<MaterialCommunityIcons name="email" color={color} size={size} />
			)
			}}
			
		/>

		<Tabs.Screen name='Student Info' component={StudentInfo} 
			options={{
			tabBarIcon: ({ color, size }) => (
				<MaterialCommunityIcons name='book-account' color={color} size={size} />
			)
			}}
		/>

      

    </Tabs.Navigator>
}
  </NavigationContainer>

}


const styles = StyleSheet.create({
    input: {
        height: 30,
        width: '80%',
        ...GlobalStyles.section,
        ...GlobalStyles.text,
        margin: 30
      
    },
    login: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        ...GlobalStyles.section,
        height: 50,
        flex: 1,
        justifyContent: 'center',
        padding: 10
    }
});