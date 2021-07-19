import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, SafeAreaView } from 'react-native';

import GlobalStyles from './GlobalStyles';
import _ from 'underscore';



interface Props {
    // ref: any, 
    res: any,
    getFunc: () => any,
    attempts:number
}

const ErrorHandler = (props: Props) => {

    const delayedRetry = () => {_(props.getFunc).delay(3000)}

    React.useEffect(() => {
        if (props.attempts < 2 && props.res?.error){
            console.log('retrying..')
            delayedRetry();  
        }

    }, [props.attempts])

    if (!props.res?.error) 
        return null;


    let message = 'Could not connect to Synergy';

    if (props.attempts < 2) {
        message += ', retrying...';
        
    }
    else if(props.res?.data) {
        message += ', information may be out of date.'
    }
    else {
        message += ', try again later.'
    }

    //need retry button
        
    return <View style={styles.container}>
        <Text style={GlobalStyles.text}>{message}</Text>
        {/* <Button title='retry' onPress={props.getFunc}/> */}

    </View>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#8f0f00',
        padding: 10

    }

})


export default ErrorHandler;
