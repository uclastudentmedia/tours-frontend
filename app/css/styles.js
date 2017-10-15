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
    loadingBackground: {
        backgroundColor: '#006699',
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
    },
    categoryFilterBtns: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.select({
          android: 0,
          ios: 10
        }),
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
        width: width,
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: 30,
        width: 30,
        borderRadius: 30,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#999999',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        // overflow: 'hidden',
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
        paddingBottom: Platform.select({
          android: 0,
          ios: 220,
        })
    },
    searchViewDataWithIcons: {
        marginTop: 50,
        marginBottom: 15,
    },
    searchViewData: {
        marginTop: 15,
    },
    myLocationBtn: {
        bottom: 150,
        right: 36,
        backgroundColor: '#ffffff',
    },
    zoomToCampusBtn: {
        bottom: 100,
        right: 36,
        backgroundColor: '#ffffff',
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
    toggleDirectionsBtn: {
        bottom: 30,
        right: 30,
        width: 45,
        height: 45,
        backgroundColor: '#246dd5',
    },
    toogleText:{
        color:"#ffffff",
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
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        elevation: 10,
        zIndex: 10,
        padding: 10,
    },
    indoorsBar:{
        position: 'absolute',
        top: Platform.select({
          android: -10,
          ios: 0,
        }),
        backgroundColor: "#f89406",
        width: width,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        elevation: 10,
        zIndex: 10,
        padding: 10,
    },
    //Searchbar Attributes
    directionsBtn: {
        flex: 7,
        borderRadius: 5,
        height: 30,
        marginTop: 10,
        backgroundColor: '#6197e4',
    },
    directionsBtnPressedColor: {
        backgroundColor: '#357add'
    },
    directionsBtnIcon: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    indoorsBtn: {
        flex: 7,
        borderRadius: 5,
        height: 30,
        marginTop: 10,
        backgroundColor: '#f8bc06',
    },
    indoorsBtnPressedColor: {
        backgroundColor: '#ab8204'
    },
    indoorsBtnIcon: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    directionsText:{
        color: 'white',
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
    imageBar: {
        flex: 0,
        flexDirection:'row',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageBarArrow: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    imageBarText: {
        textAlign: 'center',
        fontSize: 20,
    },
});
