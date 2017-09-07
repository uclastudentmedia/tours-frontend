/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import {
  TBTItem,
} from 'app/Components';

const styles = require( "../../assets/css/style");

export default class DirectionsView extends Component
{
  constructor(props){
    super(props);
    this.state = {
      results: '',
      loaded: true,
    }
  }

  render() {
    console.log("DirectionsView");
    return (
      <View style={styles.container}>
        <Text style={styles.title}>This is the Directions View</Text>
      </View>
    );
  }
}
