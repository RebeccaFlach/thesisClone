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
import api from './frontendapi';
import * as SecureStore from 'expo-secure-store';
import StudentInfo from './Pages/Student';

import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const Tabs = createBottomTabNavigator();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [appIsReady, setAppIsReady] = React.useState(false);

  	React.useEffect(() => {
		SplashScreen.preventAutoHideAsync();
		api.login().then((user) => {
			if (!user)
				setLoggedIn(false)
			else
				setLoggedIn(true);

			new Promise(resolve => setTimeout(resolve, 1000))
				.then(() => setAppIsReady(true))
		})
    
	}, [])

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady) {
		  await SplashScreen.hideAsync();
		}
	  }, [appIsReady]);
	
	  if (!appIsReady) {
		return null;
	  }

	const Login = () => {
		const [name, setName] = React.useState<string>();
		const [pass, setPass] = React.useState<string>();
		const [error, setError] = React.useState<any>();
	
		const setInfo = async () => {
			const loginMessage = await api.checkLogin(name, pass);

			if (loginMessage.data){
				const passPromise = SecureStore.setItemAsync('password', pass);
				const userPromise = SecureStore.setItemAsync('username', name);

				await Promise.all([passPromise, userPromise]);
				await api.login();
				console.log('logged in!')
				setLoggedIn(true);
				
			}
			else {
				
				setError('Incorrect username or password.');
			}
			
		}
	
		return (<SafeAreaView style={GlobalStyles.container}>
			
			<KeyboardAvoidingView style={styles.login} >
				<Text style={{color: '#c21f13', fontSize: 15}}>{error}</Text>
				<TextInput 
					placeholder='Username'
					placeholderTextColor='#b0b0b0'
					onChangeText={setName} 
					style={[GlobalStyles.input]}
					autoCompleteType='username'
					textContentType='username'
				/>
			
				<TextInput 
					placeholder='Password'
					placeholderTextColor='#b0b0b0'
					onChangeText={setPass} 
					style={[GlobalStyles.input]}
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
	
		return <View style={{flex: 1, ...GlobalStyles.container}}>
			<Stack.Navigator headerMode='none'>
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
		</View>
	}


	return <NavigationContainer >
    <StatusBar barStyle='light-content'></StatusBar>

    {!loggedIn 
	? <SignUp />
	: <View 
		onLayout={onLayoutRootView}
		style={{flex: 1}}
	>
		<Tabs.Navigator 
			tabBarOptions={{
				labelPosition: 'below-icon',
				style: {
					backgroundColor: '#121219',
					height: 50
				}
			}}
			screenOptions={({ route }) => ({
				tabBarButton: 'LoggedOut' === route.name
				? () => {
					return null;
					}
				: undefined,
			})}
		>
			<Tabs.Screen name='Grades' component={Homepage} 
				options={{
				tabBarIcon: ({ color, size }) => (
					<MaterialCommunityIcons name="home" color={color} size={size } />
				)}}
			/>
			
			<Tabs.Screen name='LoggedOut' component={SignUp} 
				//this is a hacky way to make it go back to the login screen without setting loggedIn 
				options={{
					tabBarVisible: false
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
	</View>}
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
		marginTop: 30
    },
    listItem: {
        ...GlobalStyles.section,
        height: 50,
        flex: 1,
        justifyContent: 'center',
        padding: 10
    }
});