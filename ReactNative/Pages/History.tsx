import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import api from '../api'

import GradeYear, { GradedTerm, GradedCourse } from '../../backend/src/model/History';
import { createStackNavigator } from '@react-navigation/stack';

import PDFReader from 'rn-pdf-reader-js';

const Main = ({navigation}) => {
    const [history, setHistory] = React.useState<GradeYear[]>();
    const [unweighted, setUnweighted] = React.useState<string>();
    const [weighted, setWeighted] = React.useState<string>();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        api.getHistory().then((data) => {
            setHistory(data.history);
            setUnweighted(data.unweighted)
            setWeighted(data.weighted)
            setRefreshing(false)
        })
    }, []);

    React.useEffect(() => {api.getHistory().then((data) => {
        setHistory(data.history)
        setUnweighted(data.unweighted)
        setWeighted(data.weighted)
    })}, [])


    const Header = () => {
        return <View style={[{padding: 20, marginBottom: 20}, GlobalStyles.section]}>

            <Text style={[{fontSize: 35}, GlobalStyles.text]}>GPA</Text>
            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                Weighted: {weighted}
            </Text>
            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                Unweighted: {unweighted}
            </Text>

            <Pressable onPress={() => {navigation.navigate('ReportCards')}}>
                <Text>Report Cards</Text> 
            </Pressable>
        </View>
    }

    return <View style={GlobalStyles.container}>
        <FlatList
            data={history}
            renderItem={({item}) => <Year name={item.Grade} terms={item.Terms} />}
            keyExtractor={(year) => year.Grade}

            refreshing={refreshing}
            onRefresh={onRefresh}

            ListHeaderComponent={Header}
        />
    </View>
}

const History = () => {
    const Stack = createStackNavigator();

	return <Stack.Navigator headerMode={'none'}>
		<Stack.Screen component={Main} name='Main' />
		<Stack.Screen component={ReportCards} name={'ReportCards'}/>
        <Stack.Screen component={DocView} name={'DocView'}/>
	</Stack.Navigator>
}


const Year = (props: {name:string, terms: GradedTerm[]}) => {
    return ( <View style={[GlobalStyles.section]}>
        <Text style={[GlobalStyles.text, {fontSize: 35, textAlign: 'center', padding: 15}]}>
            {props.name}
        </Text>

        {props.terms.map((term,idx) => <Term name={term.TermName} courses={term.Courses} key={idx} />)}
    </View>

    )
}

const Term = (props: {name: string, courses: GradedCourse[]}) => {
    return <View style={styles.term}>

        <Text style={[GlobalStyles.text, {fontSize: 25, textDecorationLine: 'underline',}]}>
            {props.name}{'\n'}
        </Text>

        {props.courses.map((course, idx) => (
            <View style={[ styles.grade]} key={idx}> 
                <Text 
                    style={[{flex: 1, fontSize: 20, marginRight: 10}, GlobalStyles.secondaryText]} 
                    numberOfLines={1}
                >
                    {course.CourseTitle} 
                </Text>
                <Text style={[{fontSize: 30}, GlobalStyles.text]}>
                    {course.Mark}
                </Text>
            </View>) 
        )}
    </View>
}

interface Document {
    DocumentComment: string,
    DocumentDate: string,
    DocumentFileName: string,
    DocumentGU: string,
    DocumentType: string,
    StudentGU: string, 
}
const ReportCards = ({navigation}) => {
    const [docs, setDocs] = React.useState<Document[]>();

    React.useEffect(() => {api.getDocuments().then(setDocs)},[])

    return <View style={GlobalStyles.container}>
        <FlatList 
            data={docs}
            renderItem={({item}) => <Pressable onPress={() => {
                    api.getDoc(item.DocumentGU).then((doc) => {
                        navigation.navigate('DocView', doc.Base64Code._text)
                    }
                )}  
            }
            style={[{
                height: 50,
                flex: 1, 
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10
            }, GlobalStyles.section]}
            >
                <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                    {item.DocumentComment}
                </Text>
            </Pressable>}
            keyExtractor={(doc) => doc.DocumentGU}
        
        />
    </View>
}

const DocView = ({route, navigation}) => {
    const src = 'data:application/pdf;base64,' + route.params

    return <View style={GlobalStyles.container}>
        <PDFReader
            source={{base64: src}}
            // webviewStyle={GlobalStyles.container}
        />

    </View>

}


const styles = StyleSheet.create({
    term: {
        padding: 15, 
        backgroundColor: '#202226',
        borderRadius: 20,
        margin: 15,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 12
    },
    grade: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        maxHeight: 35,
        fontSize: 20,
    }


})

export default History;