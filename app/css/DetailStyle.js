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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: 'white',
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
    }
});
