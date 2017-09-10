'use strict';

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
var windowWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
    baseText:{
        fontFamily:'sans-serif-thin'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: 'white',
        width:width,
        height:height
    },
    loadMapContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loading:{
        width:width,
        height:height,
        justifyContent:'center',
        alignItems:'center',
        paddingTop:250,
        paddingRight:15,
    },
    center:{
        fontSize: 50,
        color:'white',
    },
    map: {
        height: (height * 0.9),
        width: width
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    info: {

        padding: 20,
        paddingBottom:0,
        paddingTop:0,
        backgroundColor:'#F5FCFF',

    },
    description: {
        flex: 3,
        padding: 20,
        width: 372
    },
    locations:{
        width: width - 40
    },
    distText:{
        fontSize:16,
        color: '#B8B8B8'
    },
    loadingDistText:{
        fontSize:24,
        color: '#B8B8B8'
    },
    locText:{
        padding:20,
        fontSize:18,
        color: '#5b73a4'
    },
    loadingLocText:{
        paddingTop: 20,
        fontSize: 30,
        color: '#5b73a4'
    },
    placeholder: {
        top: 23,
        height: 40,
        width: 40
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    infoSection:{

    },
    input: {
        height: 40,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    inputWrapper1: {
        flex: 1,
        alignSelf: "stretch"
    },
    inputWrapper2: {
        alignSelf: "stretch",
        paddingTop: 5,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#B2E4F7',
        borderColor: 'red'
    },
    image: {
        paddingTop: 50,
        width: width + 20
    },
    icon: {
        height: 30,
        width: 30
    },
    icon2: {
        height: 50,
        width: 50
    },
    spin: {
        top: 40
    },
    wrapper: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection:'row'
    },
    btnContainer: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: 'transparent',
    },
    button:{
        justifyContent: 'center',
        width: windowWidth,
        backgroundColor:'#dddddd',
        padding:2
    },
    handlerText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center'
    },
    handBtn: {
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor:'#dddddd',
        padding:2,
        width: width / 3,
        height: 50
      },
    handBtnPress: {
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor:'#B2E4F7',
        padding:2,
        width: width / 3,
        height: 50
    },
    title: {
        textAlignVertical: "center",
        textAlign: "center",
        fontSize:18,
        justifyContent: 'center',
        flex: 1
    },
    slideContainer: {
        paddingRight: 359
    }
});
