import React, { Children, ReactElement } from "react"
import { FlatList, RefreshControl, Text, TextInput, View } from "react-native"
import SkeletonContent from "react-native-skeleton-content"
import { ICustomViewStyle } from "react-native-skeleton-content/lib/Constants"
import GlobalStyles from "./GlobalStyles"

const SkeletonLoader = (props:{skeleton?:ICustomViewStyle[], loading: boolean, children?}) => {
    return <SkeletonContent 
        layout={props.skeleton}
        isLoading={props.loading}
        boneColor="#202022"
        highlightColor="#444444"
        containerStyle={{width: '100%', height: '100%'}}
    >
        {props.children}
    </SkeletonContent>
}


const Search = (props:{onChange: (text:string) => any }) => {
    return <View>
        <TextInput 
            style={GlobalStyles.input} 
            onChangeText={props.onChange}
            placeholder='Search districts'
            placeholderTextColor='#b0b0b0'
        />
    </View>
}
interface ListProps {
    data: any[],
    itemRenderer: ({item:any}) => any,
    keyExtractor: (item:any) => string,
    refreshing: boolean,
    onRefresh: () => void,
    ListHeaderComponent?: any
}
const List = (props: ListProps) => {
    return <FlatList
        data={props.data}
        renderItem={props.itemRenderer}
        keyExtractor={props.keyExtractor}
        ListEmptyComponent={<Text style={GlobalStyles.text}>empty list</Text>}

        ListHeaderComponent={props.ListHeaderComponent}
        refreshControl={
            <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
                tintColor="#fff"
                title='Pull to refresh'
                titleColor={GlobalStyles.secondaryText.color}
            />
        }
    />
}



export default {
    SkeletonLoader: SkeletonLoader,
    Search: Search,
    List: List,
}