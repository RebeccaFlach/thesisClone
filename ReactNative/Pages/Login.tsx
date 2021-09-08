import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import { createStackNavigator } from '@react-navigation/stack';

import GlobalStyles from '../GlobalStyles';

import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import _ from 'underscore';
import Reusables from '../Reusables';



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
    const [error, setError] = React.useState<string>('');


    const getZip = (district) => {
        const address = district.Address.split(' ')
        return parseInt(_(address).last());
    }

    const getDistricts = () => {
        if (zip.length !== 5){
            setError('Please enter a valid zipcode');
            return;
        }
        api.getDistricts(zip).then((data) => {
            data.sort((a, b) => Math.abs(getZip(a) - parseInt(zip)) - Math.abs(getZip(b) - parseInt(zip)));

            

            navigation.navigate('DistrictList', {districts: data})
        })
    }

    return <SafeAreaView style={[GlobalStyles.container, ]} >

        <KeyboardAvoidingView 
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}} 
            behavior={"height"}
        >
            <Text style={{color: '#c21f13', fontSize: 15}}>{error}</Text>
            <TextInput 
                placeholder='Enter your zipcode'
                placeholderTextColor='#b0b0b0'
                onChangeText={setZip} 
                style={[GlobalStyles.input, {width: 200}]}
                returnKeyLabel='Enter'
                returnKeyType='go'
                onSubmitEditing={getDistricts}
            />

            <Button title='Find District' onPress={getDistricts} />
            
        </KeyboardAvoidingView>
    </SafeAreaView>

}


const DistrictList = ({route, navigation}) => {
    const districts = route.params.districts
    const [filteredDistricts, setFilteredDistricts] = React.useState(districts);

    const filterDistricts = (query) => {
        query = query.toLowerCase();
        const filtered = _(districts).filter(district => district.Name.toLowerCase().includes(query))

        setFilteredDistricts(filtered);
    }

    const renderHeader = () => <Reusables.Search onChange={filterDistricts}/>

    const selectDistrict = (district:District) => {
        AsyncStorage.setItem('domain', district.PvueURL)
        api.domain = district.PvueURL;
        navigation.navigate('Login');
        
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
    </Stack.Navigator>
}


export {EnterZip, DistrictList}
