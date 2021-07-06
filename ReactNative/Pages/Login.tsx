import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import GlobalStyles from '../GlobalStyles';
import config from '../config';

import api from '../api'

const Login = ({navigation}) => {
    const [name, setName] = React.useState<string>();
    const [pass, setPass] = React.useState<string>();

    const login = () => {
      api.login('1301246779', '3.1415fuckyou')
    }
    return (<View style={GlobalStyles.container}>
        
        <View style={styles.login} >
            <TextInput 
                onChangeText={setName} 
                style={styles.input}
            />
            <TextInput 
                onChangeText={setPass} 
                style={styles.input}
            />

            <Button onPress={login} title='login' />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      width: 100,
      borderWidth: 2
    },
    login: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    }
  });

export default Login;