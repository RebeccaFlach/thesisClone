import { SafeAreaView } from "react-native-safe-area-context"
import GlobalStyles from "../GlobalStyles"
import Reusables from "../Reusables";
import React from 'react';


const School = () => {


    return <SafeAreaView style={GlobalStyles.container}>
        <Reusables.Search onChange={console.log}/>

    </SafeAreaView>
}

export default School;