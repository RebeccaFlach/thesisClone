import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, ScrollView, RefreshControl, ListView } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

// import purify from 'DOMpurify';
import WebView from 'react-native-webview';

import textVersion from 'textversionjs'

import { MessageList, IMessage } from '../../backend/src/model/Messages';

import { createStackNavigator } from '@react-navigation/stack';
import api from '../api';


const Messages = () => {
    const Stack = createStackNavigator()
    console.log(api.loggedIn)

    //api call to update read
    
    return <Stack.Navigator headerMode={'none'}>
      <Stack.Screen component={Main} name='Messages' />
      <Stack.Screen component={FullMessage} name={'FullMessage'}/>
  </Stack.Navigator>

}

const Main = ({navigation}) => {
    const [messages, setMessages] = React.useState<IMessage[]>(null);
    const [refreshing, setRefreshing] = React.useState(false);

    React.useEffect(() => {api.getMessages().then(setMessages)}, []);

    const renderMessage = ({ item }) => {
        return <Message 
            subject={item._attributes.SubjectNoHTML} 
            content={item._attributes.Content}
            from={item._attributes.From}
            date={item._attributes.BeginDate}
            nav={navigation}
        />
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // api.getHistory()
        api.getMessages().then((data) => {
            setMessages(data);
            setRefreshing(false)
        })
    }, []);
    return <View 
        
        style={GlobalStyles.container}
    >
        <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(message) => message._attributes.ID}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />

    </View>
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

    preview = preview.replaceAll('&#39;', `'`) //yeah ill do this properly eventually
 
    return <Pressable 
        onPress={() => {
            props.nav.navigate('FullMessage', 
            {subject: props.subject, content: props.content, from: props.from, date: props.date}
            )}
        } >
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
                padding: 40px;
                margin-top: 40px;
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
            containerStyle={{backgroundColor: '#282c34', color:'#f0f0f0'}}
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