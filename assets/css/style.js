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
    map: {
        height: (height*2/3),
        width: width
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    description: {
        flex:1,
        padding: 20,
        backgroundColor:'#F5FCFF'
    },
});