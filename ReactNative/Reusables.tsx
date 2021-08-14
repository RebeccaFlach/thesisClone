import React, { Children } from "react"
import { TextInput, View } from "react-native"
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
export default {
    SkeletonLoader: SkeletonLoader,
    Search: Search
}