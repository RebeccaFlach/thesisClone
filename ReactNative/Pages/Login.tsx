import React from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import { slide as Menu } from 'react-burger-menu';

import GlobalStyles from '../GlobalStyles';
import config from '../config';

import api from '../api'

const Login = (props) => {
    const [domain, setDomain] = React.useState<string>();
    const [name, setName] = React.useState<string>();
    const [pass, setPass] = React.useState<string>();
	const [log, setLog] = React.useState(false);


    return (<View style={GlobalStyles.container}>
        
        <View style={styles.login} >
            <Text>Username:</Text>
			
            <TextInput 
                onChangeText={setName} 
                style={styles.input}
				autoCompleteType='username'
				textContentType='username'
            />

			<Text>Password: </Text>
			<TextInput 
            	onChangeText={setPass} 
              	style={styles.input}
				autoCompleteType='password'
				textContentType='password'
            />

			<Text>Domain: (ie student.tusd1)</Text>
            <TextInput 
                onChangeText={setDomain} 
                style={styles.input}
            />

            <Button onPress={() => {props.login(domain, name, pass)} }title='login' />
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
        // justifyContent: 'center',
        height: '100%',
    }
  });

export default Login;