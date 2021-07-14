import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, SafeAreaView } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import api from '../api'

import GradeYear, { GradedTerm, GradedCourse } from '../../backend/src/model/History';
import { createStackNavigator } from '@react-navigation/stack';

import PDFReader from 'rn-pdf-reader-js';
import SkeletonContent from 'react-native-skeleton-content';

const Main = ({navigation}) => {
    const [history, setHistory] = React.useState<GradeYear[]>();
    const [unweighted, setUnweighted] = React.useState<string>();
    const [weighted, setWeighted] = React.useState<string>();

    const [refreshing, setRefreshing] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true)


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
        setLoading(false);

        setHistory(data.history);
        setUnweighted(data.unweighted);
        setWeighted(data.weighted);
    })}, [])


    const Header = () => {
        return <View style={[styles.header, GlobalStyles.section]}>
            
            <Text style={[{fontSize: 35}, GlobalStyles.text]}>GPA</Text>
            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                Weighted: {weighted}
            </Text>
            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                Unweighted: {unweighted}
            </Text>
            <Pressable onPress={() => {navigation.navigate('ReportCards')}}>
                <View style={{marginTop: 10, borderColor: '#666666', borderWidth: 1, padding: 10}}>
                    <Text style={[GlobalStyles.secondaryText, {fontSize: 25}]}>
                        View Report Cards
                    </Text> 
                </View>
            </Pressable>
            
        </View>
    }

    const skeletons = [
        {...styles.header, ...GlobalStyles.section, width: '100%', children: [
            {key: 'title', width: 80, height: 40, margin: 5},
            {key: 'text1', width: 200, height: 25, margin: 5},
            {key: 'text2', width: 200, height: 25, margin: 5},
        ]
        },
        {width: '100%', ...styles.skeletonBlock, children: [
            {key: 'title', height: 40, width: 80, margin: 30},
            {key: 'block', height: 300, width: '90%'}
        ]}

    ]

    return <SafeAreaView style={GlobalStyles.container}>
        <SkeletonContent 
            boneColor="#121212"
			highlightColor="#333333"
			containerStyle={{width: '100%', flex: 1}}
            isLoading={loading}
            layout={skeletons}
        >
            <FlatList
                data={history}
                renderItem={({item}) => <Year name={item.Grade} terms={item.Terms} />}
                keyExtractor={(year) => year.Grade}

                refreshing={refreshing}
                onRefresh={onRefresh}

                ListHeaderComponent={Header}
            />
        </SkeletonContent>
    </SafeAreaView>
}

const History = () => {
    const Stack = createStackNavigator();

	return <Stack.Navigator headerMode={'none'}>
		<Stack.Screen component={Main} name='Main' options={{
            headerShown: false
        }} />
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

const ReportCard = () => {
    
}

const ReportCards = ({navigation}) => {
    const [docs, setDocs] = React.useState<Document[]>();

    React.useEffect(() => {api.getDocuments().then(setDocs)},[])

    return <SafeAreaView style={GlobalStyles.container}>
        <FlatList 
            data={docs}
            renderItem={({item}) => <View
            style={[{
                // height: 50,
                flex: 1, 
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10,
                paddingLeft: 20
            }, GlobalStyles.section]}
            ><Pressable onPress={() => {
                    api.getDoc(item.DocumentGU).then((doc) => {
                        navigation.navigate('DocView', doc.Base64Code._text)
                    }
                )}  
            }
            style={{padding: 10}}
            >
                <Text style={[GlobalStyles.secondaryText, {fontSize: 20, flex: 1}]} numberOfLines={1}>
                    {item.DocumentComment}
                </Text>
            </Pressable>
            </View>
            }
            keyExtractor={(doc) => doc.DocumentGU}
        
        />
    </SafeAreaView>
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
    },
    header: {
        padding: 20, 
        marginBottom: 20, 
        // height: 150
    },
    skeletonBlock: {
        alignItems: 'center',
        flex: 1
    }


})

export default History;