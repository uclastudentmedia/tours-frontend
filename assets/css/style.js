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
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    loading:{
        backgroundColor: '#B2E4F7',
        flex:1,
        width:width,
        justifyContent:'center',
        alignItems:'center',
        bottom: 0
    },
    center:{
        fontSize: 50,
    },
    loading_logo:{
        width:200,
        height:175,
        bottom: 10
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
        paddingBottom:0,
        paddingTop:0,
        backgroundColor:'#F5FCFF'
    },
    description: {
        flex: 3,
        padding: 20,
        width: 372
    },
    locations:{
        width: width - 40
    },
    locText:{
        padding:10,
        fontSize:30
    },
    infoSection:{

    },
    spin: {
        top: 40
    }
});
