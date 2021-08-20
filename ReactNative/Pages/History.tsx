import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, SafeAreaView, Image } from 'react-native';

import GlobalStyles from '../GlobalStyles';
import api from '../frontendapi'

import GradeYear, { GradedTerm, GradedCourse } from '../../backend/src/model/History';
import { createStackNavigator } from '@react-navigation/stack';

import PDFReader from 'rn-pdf-reader-js';
import SkeletonContent from 'react-native-skeleton-content';
import ErrorHandler from '../ErrorHandler';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import Reusables from '../Reusables';

const CourseHistory = () => {
    const [historyRes, setHistoryRes] = React.useState(null);
    const [attempts, setAttempts] = React.useState<number>(0);

    const [refreshing, setRefreshing] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);

    const getHistory = () => {
        return api.getHistory().then((res:any) => {
            setHistoryRes(res);
            
            if (res.error)
				setAttempts(attempts + 1)
        })
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getHistory().then(() => setRefreshing(false))

    }, []);

    React.useEffect(() => {getHistory().then(() => {
        setLoading(false);
    })}, [])


    const Gpa = () => {
        const unweighted = historyRes?.data?.unweighted ;
        const weighted = historyRes?.data?.weighted;

        return <View style={[styles.header, GlobalStyles.section]}>
            
            <Text style={[{fontSize: 35}, GlobalStyles.text]}>GPA</Text>
            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                Weighted: {weighted?.substring(0,10)}
            </Text>
            <Text style={[GlobalStyles.secondaryText, {fontSize: 20}]}>
                Unweighted: {unweighted?.substring(0,10)}
            </Text>
        </View>
    }

    const skeletons = [
        { ...styles.header, width: '100%', children: [
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
        <ErrorHandler res={historyRes} getFunc={getHistory} attempts={attempts}/>

            <SkeletonContent 
                boneColor="#202022"
                highlightColor="#444444"
                containerStyle={{width: '100%', flex: 1}}
                isLoading={loading}
                layout={skeletons}
            >        
                <Reusables.List
                    data={historyRes?.data?.history}
                    itemRenderer={({item}) => <Year name={item.Grade} terms={item.Terms} />}
                    keyExtractor={(year) => year.Grade}

                    refreshing={refreshing}
                    onRefresh={onRefresh}

                    ListHeaderComponent={Gpa}
                /> 
            </SkeletonContent>
    </SafeAreaView>
}


const Year = (props: {name:string, terms: GradedTerm[]}) => {
    return ( <View style={{marginBottom: 20}}>
        <Text style={[GlobalStyles.text, {fontSize: 35, textAlign: 'center', padding: 15}]}>
            {props.name}
        </Text>

        {props.terms.map((term,idx) => <Term name={term.TermName} courses={term.Courses} key={idx} />)}
    </View>

    )
}

const Term = (props: {name: string, courses: GradedCourse[]}) => {
    return <View style={[GlobalStyles.section, {padding: 20, marginBottom: 20}]}>
        <View>
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



const Documents = ({navigation}) => {
    const [docs, setDocs] = React.useState<Document[]>();

    //ERROR HANDLING

    React.useEffect(() => {
        api.getDocuments().then((res) => setDocs(res.data))}
    ,[])

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
                        navigation.navigate('DocView', doc.data.Base64Code._text)
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

    return <SafeAreaView style={GlobalStyles.container}>
        <PDFReader
            source={{base64: src}}
            style={GlobalStyles.container}
            customStyle={{
                readerContainerZoomContainer: GlobalStyles.container
            }}
        />

    </SafeAreaView>

}


const styles = StyleSheet.create({
    term: {
        padding: 15, 
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
    },
    pageLink: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 30,
        padding: 10
    }


})
export {DocView, Documents}
export default CourseHistory;