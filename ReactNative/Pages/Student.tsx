import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable, ScrollView, RefreshControl, SafeAreaView, Image } from 'react-native';
import config from '../config';
import GlobalStyles from '../GlobalStyles';


import { createStackNavigator } from '@react-navigation/stack';
import api from '../frontendapi';
import SkeletonContent from 'react-native-skeleton-content';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CourseHistory, {Documents, DocView} from './History';
import Schedule from './Schedule';
import School from './School';


const Main = ({navigation}) => {
   
    const Student = () => {
        const [studentLoading, setStudentLoading] = React.useState(true);
        const [studentInfo, setStudentInfo] = React.useState(null);

        React.useEffect(() => {

            api.getStudentInfo().then((data) => {
                // console.log(data)
                setStudentInfo(data.data);
                setStudentLoading(false)});
        }, [])

        const studentSkeletons = [
            {
                flex: 1, flexDirection: "row", children: [
                    { ...styles.header, width: 100, height: 100, borderRadius: 100},
                    {  height: 40, width: 80, margin: 30}
                ]
            }
        ]

        const ProfilePic = () => <Image 
            style={{width: 90, height: 90, borderRadius: 100, marginRight: 20}}
            source={{uri: 'data:image/png;base64,' + studentInfo?.Photo._text}}
        />

        return <View style={[GlobalStyles.section, styles.header, {height: 160}]}>
            <SkeletonContent 
                boneColor="#202022"
                highlightColor="#444444"
                containerStyle={{width: '100%', flex: 1}}
                isLoading={studentLoading}
                layout={studentSkeletons}
            >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                    <ProfilePic />
                    <View>
                        <Text style={[GlobalStyles.text, {fontSize: 25, marginBottom: 10}]}>
                            {studentInfo?.FormattedName._text}
                        </Text>
                        <Text style={[GlobalStyles.secondaryText, {fontSize: 20, flex: 1}]}>
                            {studentInfo?.PermID._text}
                        </Text>
                    </View>
                </View>

            </SkeletonContent>

        </View>
    }

    const Links = () => {

        const PageLink = (props: {title: string, icon: string, navTo?: string}) => {
            return <Pressable 
                onPress={() => navigation.navigate(props.navTo || props.title)} 
                style={[ {height: 70, padding: 10}, GlobalStyles.section]}
            >
                <View style={{height: 90, flex: 1, flexDirection: 'row', alignItems: 'center'}}>

                    <Icon 
                        name={props.icon} 
                        size={30} 
                        color={GlobalStyles.secondaryText.color} 
                        style={{opacity: 0.5}}
                    />  
                    <Text style={[GlobalStyles.text, styles.pageLink]}>{props.title}</Text>
                </View>
                
            </Pressable>
        }
        '&'

        return <View style={{}}>

            <PageLink title='Course History' icon='history' navTo='CourseHistory' />

            <PageLink title='Documents' icon='file' navTo='Documents' />

            {/* <PageLink title={'School & Staff'} icon='school' navTo='SchoolInfo' /> */}

            <PageLink title='Schedule' icon='clock' />
           
        </View>
        //todo: student (more) info, school, schedule
    }


    return <SafeAreaView style={GlobalStyles.container}>
        {/* <ErrorHandler res={historyRes} getFunc={getHistory} attempts={attempts}/> */}
        <ScrollView>
            <Student />
            <Links />
        </ScrollView>
    </SafeAreaView>
}

const StudentInfo = () => {
    const Stack = createStackNavigator();

	return <View style={{flex: 1, ...GlobalStyles.container}}>
        <Stack.Navigator>
            <Stack.Screen component={Main} name='Main' options={{
                headerShown: false
            }} />
            <Stack.Screen component={Documents} name={'Documents'}
                options={{
                    ...GlobalStyles.header,
                    title: 'Documents'
                }}
            />
            <Stack.Screen component={CourseHistory} name={'CourseHistory'}
                options={{
                    ...GlobalStyles.header,
                    title: 'Course History'
                }}
            />
            <Stack.Screen component={DocView} name={'DocView'}
                options={{
                    ...GlobalStyles.header,
                    title: 'Document'
                }}
            />
            <Stack.Screen component={Schedule} name={'Schedule'}
                options={{
                    ...GlobalStyles.header,
                
                }}
            />
            <Stack.Screen component={School} name={'SchoolInfo'}
                options={{
                    ...GlobalStyles.header,
                
                }}
            />
        </Stack.Navigator>
    </View>
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
        fontSize: 18,
        padding: 10
    }


})

export default StudentInfo;