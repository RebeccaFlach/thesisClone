import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import { createStackNavigator } from '@react-navigation/stack';

import GlobalStyles from '../GlobalStyles';
import config from '../config';

import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import _ from 'underscore';

const Login = () => {
    const [name, setName] = React.useState<string>();
    const [pass, setPass] = React.useState<string>();

    const setInfo = () => {
        SecureStore.setItemAsync('password', pass)
        SecureStore.setItemAsync('username', name)
    }

    return (<SafeAreaView style={GlobalStyles.container}>
        
        <KeyboardAvoidingView style={styles.login} >
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
                />

            <Button onPress={setInfo}title='login' />
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
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


interface District {
    Address: string,
    DistrictID: string,
    Name: string,
    PvueURL: string
}


const EnterZip = ({navigation}) => {
    const [zip, setZip] = React.useState<string>('');


    const getZip = (district) => {
        const address = district.Address.split(' ')
        return parseInt(_(address).last());
    }

    const getDistricts = () => {
        api.getDistricts(zip).then((data) => {
            data.sort((a, b) => Math.abs(getZip(a) - parseInt(zip)) - Math.abs(getZip(b) - parseInt(zip)));

            

            navigation.navigate('DistrictList', {districts: data})
        })
    }

    return <SafeAreaView style={[GlobalStyles.container, {flex: 1, justifyContent: 'center', alignItems: 'center'}]} >

        <KeyboardAvoidingView 
            style={{width: '100%', marginBottom: 50}} 
            behavior={Platform.OS === "ios" ? "position" : "height"}
            keyboardVerticalOffset={30}
        >
            <TextInput 
                placeholder='Enter your zipcode'
                placeholderTextColor='#b0b0b0'
                onChangeText={setZip} 
                style={[styles.input, GlobalStyles.text]}
            />

            <Button title='Find District' onPress={getDistricts} />
        </KeyboardAvoidingView>
    </SafeAreaView>

}


const Search = (props) => {
    return <View>
        <TextInput 
            style={styles.input} 
            onChangeText={props.filterFunc}
            placeholder='Search districts'
            placeholderTextColor='#b0b0b0'
        />
    </View>
}


const DistrictList = ({route, navigation}) => {
    const districts = route.params.districts
    const [filteredDistricts, setFilteredDistricts] = React.useState(districts);

    const filterDistricts = (query) => {
        query = query.toLowerCase();
        const filtered = _(districts).filter(district => district.Name.toLowerCase().includes(query))

        setFilteredDistricts(filtered);
    }

    const renderHeader = () => <Search filterFunc={filterDistricts}/>

    const selectDistrict = (district:District) => {
        api.storeData('domain', district.PvueURL)
        api.domain = district.PvueURL;
        navigation.navigate('Login')
        
    }

    return <SafeAreaView style={GlobalStyles.container}>
        <FlatList 
            data={filteredDistricts}
            renderItem={({item}) => <Pressable style={styles.listItem} onPress={() => selectDistrict(item)}>
                <Text style={GlobalStyles.text}>{item.Name}</Text>
            </Pressable>}
            keyExtractor={(district) => district.Name}
            ListHeaderComponent={renderHeader()}
        />
    </SafeAreaView>
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

export default SignUp;

export {EnterZip, DistrictList}
