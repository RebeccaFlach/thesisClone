import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

// import purify from 'DOMpurify';
import WebView from 'react-native-webview';

import textVersion from 'textversionjs'

import { MessageList, IMessage } from '../../backend/src/model/Messages';

import { createStackNavigator } from '@react-navigation/stack';
import api from '../api';


const Messages = ({navigation}) => {
    const [messages, setMessages] = React.useState<IMessage[]>(null);

    const Stack = createStackNavigator()
 
    const parentNav = navigation;

    const getMessages = () => {
        api.getMessages().then(setMessages);
    }

    console.log(api.loggedIn)

    //api call to update rea
    React.useEffect(getMessages, []);
    

    const Main = ({navigation}) => {

    const renderMessage = ({ item }) => {
        return <Message 
            subject={item._attributes.SubjectNoHTML} 
            content={item._attributes.Content}
            from={item._attributes.From}
            date={item._attributes.BeginDate}
            nav={navigation}
        />
    }
        return <View style={GlobalStyles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(message) => message._attributes.ID}
            />

        </View>
    }

    return <Stack.Navigator headerMode={'none'}>
      <Stack.Screen component={Main} name='Messages' />
      <Stack.Screen component={FullMessage} name={'FullMessage'}/>
  </Stack.Navigator>

}

interface Props {
    subject: string,
    content: string,
    from: string,
    date: string
}

const Message = (props) => {
    let preview = textVersion(props.content)
    if (preview.length > 75)
        preview = preview.substring(0, 70) + '...';

    preview = preview.replaceAll('&#39;', `'`)
 
    return <Pressable 
        onPress={() => {props.nav.navigate('FullMessage', {...props})}} >
        <View style={[styles.message]}>
            <Text style={[GlobalStyles.text]}>
                <Text style={{fontSize: 12, color: '#e0e0e0'}}>{ props.from }</Text> {'\n'}
                <Text style={{fontSize: 20}}>{ props.subject }</Text> {'\n'}
                <Text style={{color: '#d0d0d0'}}>{preview}</Text>

            </Text>
        </View>
    </Pressable> 
}

const FullMessage = ({route, navigation}) => {
    const style = `
        <style>
            body {
                background-color: #282c34;
                color: #f0f0f0 !important;
                font-size: 3.5rem;
                max-width: 100%;
                overflow-wrap: break-word;
            }
            span {
                color: #f0f0f0 !important;
                font-size: 3.5rem !important;
            }
            a {
                color: #91ADD4 !important;
            }
        </style>
        
    `;

    return <View style={GlobalStyles.container}>
        <WebView
            style={GlobalStyles.container}
            containerStyle={{backgroundColor: '#282c34',marginTop: 20, padding: 20, color:'#f0f0f0'}}
            originWhitelist={['*']}
            source={{ html:  style + route.params.content}}
        />
    </View>
}

const styles = StyleSheet.create({
    message: {
        padding: 20, 
        minHeight: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#666666',
    }
})

export default Messages;