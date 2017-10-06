'use strict';

/**
 * Created by Daniel on 2/3/2017.
 */
import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';

const {height, width} = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    baseText:{
        fontFamily: Platform.select({
          android: 'sans-serif',
          ios: 'Helvetica-Light',
        })
    },
    titleText:{
        color: Platform.select({
          android: '#ffffff',
          ios: '#246dd5',
        }),
        textAlign: Platform.select({
          android: 'left',
          ios: 'center',
        }),
        top: Platform.select({
          android: 0,
          ios: 0,
        }), 
        fontSize: 20,
        backgroundColor:'transparent',
        flex: 1,
        alignItems: 'center',
        justifyContent: Platform.select({
          ios: 'center',
        }),
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: 'white',
        width:width,
        height:height,
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
        height: height,
        width: width,
        zIndex: -1,
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
    locList:{
        flex:1,
        width:width
    },
    locListIcon: {
        flex: 1,
        maxWidth: 40,
        alignSelf: 'center'
    },
    listHeader:{
        flex:4,
        width:width
    }
    ,
    distText:{
        fontSize:16,
        color: '#B8B8B8'
    },
    loadingDistText:{
        fontSize:24,
        color: '#B8B8B8'
    },
    locText:{
        padding:0,
        fontSize:25,
        color: '#5b73a4',
    },
    listItemText:{
        padding:5,
        flex: 1,
    },
    listItemBorder:{
        borderBottomWidth: 1,
        borderColor: '#dddddd',
    },
    listItemContainer: {
        flex: 1,
        flexDirection: 'row',
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
        width:width*.9,
        paddingLeft:width*.025,
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
        flex:1,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection:'row',
        width:width,
        padding: 5
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
        padding:0,
        paddingTop: 0,
        paddingBottom: 0,
        top: 0,
        bottom: 0
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
    },
    buttonContainer: {
        flex: 1
    },
    errorText: {
        color: '#d61414',
        fontSize: 22,
    },
    warningText: {
        color: '#ffbf00',
        fontSize: 22,
    },
    mapViewBtn: {
        paddingTop: 5,
        alignItems: 'center',
        position: 'absolute',
        height: 30,
        width: 30,
        borderRadius: 15,
        paddingTop: 2.5,
        paddingLeft:2.5,
        // borderWidth: 1,
        backgroundColor: '#246dd5', 
        // borderColor: '#ffffff',
        shadowOffset: { width: 0, height: 3 },
        shadowColor: '#eeeeee',
        shadowOpacity: 0.5,
        elevation: 3,
        overflow: 'hidden',
    },
    mapViewSearchBtn: {
        backgroundColor: Platform.select({
          android: '#246dd5',
          ios: '#ffffff',
        }),
    },
    searchBar: {
        backgroundColor: Platform.select({
          android: '#246dd5',
          ios: '#ffffff',
        }),
        position: 'absolute',
        top: 0,
        paddingTop: Platform.select({
          android: 0,
          ios: 10,
        }),
        paddingRight:20,
        paddingLeft:5,
        height: 60,
        width: width,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: '#999999',
        shadowOpacity: 1,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ScrollViewBottom: {
        marginBottom: Platform.select({
          android: 0,
          ios: 220,
        })
    },
    myLocationBtn: {
        bottom: 30,
        right: 30,
    },
    zoomToCampusBtn: {
        bottom: 80,
        right: 30,
    },
    dirStartBtn: {
        paddingTop: 5,
        alignItems: 'center',
        bottom: 80,
        right: 30,
        position: 'absolute',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: '#246dd5', 
        borderColor: '#ffffff'
    },
    inStartBtn: {
        paddingTop: 5,
        alignItems: 'center',
        bottom: 80,
        right: 30,
        position: 'absolute',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: '#43A047', 
        borderColor: '#ffffff'
    },
    helpBtn:{
        marginTop: 5
    },
    toggleDirectionsBtn: {
        bottom: 130,
        right: 30,
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
//Below: Edits the directions searchbar on MainMapView
//Container
    directionsBar:{
        position: 'absolute',
        backgroundColor: "#246dd5",
        width: width,
        alignItems: 'center'
    },
    indoorsBar:{
        top: 0,
        position: 'absolute',
        backgroundColor: "#f89406",
        width: width,
        alignItems: 'center'
    },
//Searchbar Attributes
    directionsBtnColor:{
        backgroundColor: '#ffffff'
    },
    indoorsBtnColor:{
        backgroundColor: '#f8bc06'  
    },
    directionsBtnTop:{
        borderRadius: 5,
        height: 30,
        width: width - 10,
        marginTop: 10,
        marginBottom: 5
    },
    directionsBtnBot:{
        borderRadius: 5,
        height: 30,
        width: width - 10,
        marginTop: 5,
        marginBottom: 10
    },
    indoorsMidBot:{
        borderRadius: 5,
        height: 30,
        width: width - 40,
        marginTop: 5,
        marginBottom: 10,
        marginRight: 5
    }, 
    indoorsBtnBot:{
        borderRadius: 5,
        height: 30,
        width: width - 10,
        marginBottom: 10
    }, 
    directionsText:{
        marginTop: 5,
        marginLeft: 10,
        fontSize: 17
    },
    indoorsText:{
        color: 'white',
        marginTop: 5,
        marginLeft: 10,
        fontSize: 17
    },
    indoorHelp:{
        flex: 1,
        flexDirection: 'row'
    }
});
