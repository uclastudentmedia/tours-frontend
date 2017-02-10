/**
 * Created by Daniel on 2/3/2017.
 */
const React = require("react-native");
import {
    StyleSheet,
    Dimensions
} from "react-native";
import MapView from 'react-native-maps'

var {height, width} = Dimensions.get('window');

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    loading:{
        backgroundColor: '#B2E4F7',
        flex:1,
        width:width,
        justifyContent:'center',
        alignItems:'center'
    },
    center:{
        fontSize: 50
    },
    loading_logo:{
        width:100,
        height:100,
    },
    map: {
        height: (height*2/3),
        width: width
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    info: {
        flex:1,
        padding: 20,
        backgroundColor:'#F5FCFF'
    },
    description: {
        flex: 3,
        padding: 20,
        width: 372
    }
});
