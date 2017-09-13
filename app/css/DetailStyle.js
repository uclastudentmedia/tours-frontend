'use strict';

/**
 * Created by danielhuang on 5/26/17.
 */
import React from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';

var {height, width} = Dimensions.get('window');

export default StyleSheet.create({
    titleSec:{
        flex:.1,
        flexDirection:'row',
        marginTop:10,
        alignItems:'center',
    },
    title: {
        color:'rgb(95,115,139)',
        fontSize:30,
        marginLeft:10
    },
    icon:{height: 40, width: 40},
    dist:{ },
    description:{flex:1, flexDirection:'row',padding:15, fontSize:20},
    displayImage: {
        marginTop:20,
      width: width,
      height: width * 0.75,
    },
    thumbnailImage: {
      width: 100,
      height: 75,
    }
});
