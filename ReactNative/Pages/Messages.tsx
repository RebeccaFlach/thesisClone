import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, ScrollView } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';

import textVersion from 'textversionjs'

import { MessageList, IMessage } from '../../backend/src/model/Messages'

const Messages = ({navigation}) => {
    const [messages, setMessages] = React.useState<IMessage[]>(null);

    //test!
    const getMessages = () => {
        // axios.get(gradeUrl + 'ping').then(console.log)
        // .catch(console.log)
    
        axios.get(config.url + 'messages', config.axiosOpts)
          .then((res) => {
            console.log(res.data)
            setMessages(res.data)
        })
    }

    //api call to update read?
    React.useEffect(getMessages, []);
    const renderMessage = ({ item }) => {


        return <Message 
            subject={item.SubjectNoHTML} 
            content={item.Content}
            from={item.From}
            date={item.BeginDate}
        />
    }

    return <View style={GlobalStyles.container}>
        <Button
            title="X"
            onPress={() => navigation.toggleDrawer()}
        />
        <Button onPress={getMessages} title="Refresh" />
        
        <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(message) => message.ID}
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
    if (preview.length > 50)
        preview = preview.substring(0, 50) + '...'

    //make global shorten util function
    return <Text style={[GlobalStyles.text, styles.message]}>
        <Text style={{fontSize: 12, color: '#e0e0e0'}}>{ props.from.trim() }</Text> {'\n'}
        <Text style={{fontSize: 20}}>{ props.subject.trim() }</Text> {'\n'}
        <Text style={{color: '#d0d0d0'}}>{preview}</Text>

    </Text>
    //class or sender (class preffered, can map that data) //date
    //subject
    //longish snippet
}

const styles = StyleSheet.create({
    message: {
        padding: 20, 
        minHeight: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: '#666666'
    }
})

export default Messages;