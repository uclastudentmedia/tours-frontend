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

module.exports = StyleSheet.create({
    titleSec:{
        flex:.1,
        flexDirection:'row',
        marginTop:60,
        alignItems:'center',
    },
    title: {
        color:'rgb(95,115,139)',
        fontSize:30,
        marginLeft:10
    },
    icon:{height: 40, width: 40},
    dist:{marginTop:-10}
});