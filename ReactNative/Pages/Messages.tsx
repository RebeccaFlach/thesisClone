import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, ScrollView, RefreshControl,  SafeAreaView, Linking } from 'react-native';
import GlobalStyles from '../GlobalStyles';

import WebView from 'react-native-webview';

import textVersion from 'textversionjs'

import { createStackNavigator } from '@react-navigation/stack';
import api from '../frontendapi';
import SkeletonContent from 'react-native-skeleton-content';

import ErrorHandler from '../ErrorHandler';
import Reusables from '../Reusables';

import linkify from 'linkifyjs/html';
import {decode} from 'html-entities';

const Messages = () => {
    const Stack = createStackNavigator()
    //api call to update read
    
    return <View style={GlobalStyles.container} >
        <Stack.Navigator>
            <Stack.Screen component={Main} name='Messages' options={{
                headerShown: false
            }}/>
            <Stack.Screen component={FullMessage} name={'FullMessage'}
                options={{
                    ...GlobalStyles.header,
                    title: 'Message'
                }}
            />
        </Stack.Navigator>
    </View>

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
        // api.markRead()
	}, []);

    const renderMessage = ({ item }) => {
        // console.log(item.AttachmentDatas.AttachmentData)
        if (!item._attributes.Read)
            console.log('not read!')
        return <Message 
            subject={item._attributes.SubjectNoHTML} 
            content={item._attributes.Content}
            from={item._attributes.From}
            date={item._attributes.BeginDate}
            attachments={item.AttachmentDatas.AttachmentData}
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

    return <SafeAreaView  style={GlobalStyles.container}>
        <ErrorHandler res={res} attempts={attempts} getFunc={getMessages}/>
        <Reusables.SkeletonLoader
            skeleton={Array(4).fill(messageSkeleton)}
            loading={loading}
        >
            <Reusables.List 
                data={messages}
                itemRenderer={renderMessage}
                keyExtractor={(message) => message._attributes.ID}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </Reusables.SkeletonLoader>

    </SafeAreaView>
}


const Message = (props) => {
    let preview = textVersion(props.content)
    if (preview.length > 75)
        preview = preview.substring(0, 70) + '...';

    preview = decode(preview)
 

    React.useEffect(() => {
        if (props.attachments && props.attachments[0]){
            const fileInfo = props.attachments[0]._attributes.SmAttachmentGU;
            console.log(fileInfo)

            
        }


    }, [])
    return <Pressable 
        onPress={() => {
            props.nav.navigate('FullMessage', 
            {subject: props.subject, content: props.content, from: props.from, date: props.date}
            )}
        } >
        <View style={[styles.message, GlobalStyles.section]}>
            <Text style={[GlobalStyles.text]}>
                <Text style={[{fontSize: 12}, GlobalStyles.secondaryText]}>{ props.from }</Text> {'\n'}
                <Text style={{fontSize: 20}}>{ props.subject }</Text> {'\n'}
                <Text style={GlobalStyles.secondaryText}>{preview}</Text>

            </Text>
        </View>
    </Pressable> 
}

const FullMessage = ({route, navigation}) => {
    const [webviewLoaded, setWebviewLoaded] = React.useState<boolean>(false);

    const message = route.params;

    const style = `
        <style>
            html {
                background-color: ${GlobalStyles.container.backgroundColor};
                color: ${GlobalStyles.text.color};
                font-size: 3.5rem;
                max-width: 100%;
                overflow-wrap: break-word;
                
            }
            #main {
                background-color: ${GlobalStyles.section.backgroundColor};
                padding: 40px;
                min-height: 100%;

            }
            a {
                color: #91ADD4 !important;
            }
        </style>
        <h3>${message.subject}</h3>
        
    `;

    let content = message.content.replace(/style=".*"/gm, '') //remove styles because tusd is committed to eyesores
    content = linkify(content)

    return <SafeAreaView style={GlobalStyles.container}>
        <WebView
            onLoadStart={event => { //prevent flash of white screen 
                setTimeout(() => {
                    setWebviewLoaded(true);
                }, 350)
            }}
            originWhitelist={['*']}
            style={[{ opacity: webviewLoaded ? 1 : 0},]}
            source={{ html:  '<div id="main">' + style + content + '</div>'}}
            onShouldStartLoadWithRequest={event => {
                //open external links in browser
                if (event.url !== 'about:blank') {
                    Linking.openURL(event.url)
                    return false;
                }
                return true;
            }}
        />
       
    </SafeAreaView>
}

const styles = StyleSheet.create({
    message: {
        padding: 20, 
        minHeight: 50,
    }
})

export default Messages;