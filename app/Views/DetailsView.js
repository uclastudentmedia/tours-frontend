'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
const styles = require( "../../assets/css/style");
const dstyles= require('../../assets/css/detailStyle');

export default class DetailsView extends Component
{
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`
  });

  constructor(props) {
    super(props);
    this.state = {
      results: '',
    }
  }

  //<Button onPress={this.findRoute.bind(this)} title="Navigate Here!"></Button>
  //{this.state.results.results.name}
  render() {
    return (
      <View style={styles.container}>
        <View style={dstyles.titleSec}>
          {/*renderImage(this.state.results.results.category,'details')*/}
          <Text style={dstyles.title}>
            blah
          </Text>
        </View>
        <Text style={dstyles.dist}>
          {/*feetCalc(this.state.curLocation.latitude,
                    this.state.curLocation.longitude,
                    this.state.results.results.lat,
                    this.state.results.results.long)*/} feet away
        </Text>
      </View>
    );
  }
}
