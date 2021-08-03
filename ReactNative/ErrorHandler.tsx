import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, SafeAreaView } from 'react-native';

import GlobalStyles from './GlobalStyles';
import _ from 'underscore';



interface Props {
    res: any,
    getFunc: () => any,
    attempts:number
}

const ErrorHandler = (props: Props) => {

    const delayedRetry = () => {_(props.getFunc).delay(4000)}

    React.useEffect(() => {
        if (props.attempts < 2 && props.res?.error){
            console.log('retrying..')
            console.log(props.res.error)
            delayedRetry();  
            console.log(props.res.error)
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

    //errors
        //not available
            //Class Schedule data not available for this school
            //School District has not enabled access for the GradeBook Module.

    //need retry button
        
    return <View style={styles.container}>
        <Text style={GlobalStyles.text}>{message}</Text>
        {/* <Button title='retry' onPress={props.getFunc}/> */}

    </View>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#9c3333',
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 }

    }

})


export default ErrorHandler;
