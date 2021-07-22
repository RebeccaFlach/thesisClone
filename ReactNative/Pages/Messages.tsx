import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, ScrollView, RefreshControl, ListView, SafeAreaView, Linking } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

// import purify from 'DOMpurify';
import WebView from 'react-native-webview';

import textVersion from 'textversionjs'

import { MessageList, IMessage } from '../../backend/src/model/Messages';

import { createStackNavigator } from '@react-navigation/stack';
import api from '../api';
import SkeletonContent from 'react-native-skeleton-content';

import ErrorHandler from '../ErrorHandler';


const Messages = () => {
    const Stack = createStackNavigator()
    //api call to update read
    
    return <Stack.Navigator headerMode={'none'}>
        <Stack.Screen component={Main} name='Messages' />
        <Stack.Screen component={FullMessage} name={'FullMessage'}/>
    </Stack.Navigator>

}

const Main = ({navigation}) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [res, setRes] = React.useState(null);
    const [attempts, setAttempts] = React.useState<number>(0);
    const messages = res?.data;

    const getMessages = () => {
		return api.getMessages().then((res) => {
			setRes(res);
			if (res.error)
				setAttempts(attempts + 1)
		})
    }

    React.useEffect(() => {	
		getMessages().then(() => setLoading(false))
	}, []);

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
        getMessages().then(() => {
            setRefreshing(false)
        })
    }, []);

    const messageSkeleton = {
	  ...styles.message, width: '100%', padding: 10, children: [
          {key: 'subject', width: '80%', height: 30, margin: 10},
          {key: 'text', width: '60%', height: 25, margin: 10}
      ]
    }

    // console.log(messages)
    return <SafeAreaView  style={GlobalStyles.container}>
        <ErrorHandler res={res} attempts={attempts} getFunc={getMessages}/>
        <SkeletonContent 
            layout={Array(4).fill(messageSkeleton)}
            isLoading={loading}
            boneColor="#121212"
			highlightColor="#333333"
        >
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(message) => message._attributes.ID}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </SkeletonContent>

    </SafeAreaView>
}


const Message = (props) => {
    let preview = textVersion(props.content)
    if (preview.length > 75)
        preview = preview.substring(0, 70) + '...';

    preview = preview.replace(/&#39;/g, `'`) //yeah ill do this properly eventually
 
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


    const message = route.params;

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
        <h2>${message.subject}</h2>
        
    `;
   

    return <SafeAreaView style={GlobalStyles.container}>
        <WebView
            originWhitelist={['*']}
            source={{ html:  style + message.content}}
            onShouldStartLoadWithRequest={event => {
                //open external links in browser
                if (event.url !== 'about:blank') {
                    Linking.openURL(event.url)
                    return false
                }
                return true
            }}
        />
       
    </SafeAreaView>
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