'use strict';

/**
 * Created by danielhuang on 5/26/17.
 */
import React from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';

const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: 'white',
        paddingBottom: 15
    },
    titleSec:{
        flex:1,
        flexDirection:'row',
        margin:10,
        alignItems:'center',
    },
    title: {
        flex: 1,
        color:'rgb(95,115,139)',
        fontSize:30,
        marginLeft:10,
    },
    icon:{
      height: 40,
      width: 40,
    },
    dist:{
      marginTop: 10
    },
    description:{
      padding:15,
      fontSize:16
    },
    displayImage: {
      width: width,
      height: width * 0.75,
    },
    thumbnailImage: {
      width: 100,
      height: 75,
    },
    mapBtn: {
      flex: 1,
      margin: 10,
    },
    /* Attributes */
    attrContainer: {
      padding: 15
    },
    attrIndent: {
      marginLeft: 10
    },
    // base styles
    attrLabel: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    attrText: {
      fontSize: 16,
    },
    attrHeader: {
      fontWeight: 'bold',
    },
    // per-depth styles
    attrHeader0: {
      fontSize: 28,
      marginBottom: 10,
    },
    attrLabel1: {
      fontSize: 18,
    },
    attrText1: {
      fontSize: 18
    },
    attrHeader1: {
      fontSize: 26,
    },
    attrLabel2: {
    },
    attrText2: {
    },
    attrHeader2: {
      fontSize: 24,
    },
    attrLabel3: {
    },
    attrText3: {
    },
    attrHeader3: {
    },
});
