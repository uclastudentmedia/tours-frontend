/**
 * Created by danielhuang on 5/26/17.
 */
const React = require("react-native");
import {
    StyleSheet,
    Dimensions
} from "react-native";
import MapView from 'react-native-maps'

var {height, width} = Dimensions.get('window');
var windowWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
    search:{
        flexDirection: 'column', 
        flex: 1
    },
    button:{
        width: windowWidth,
        marginBottom: 1
    }
});