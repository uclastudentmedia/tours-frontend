'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import { RenderIcon } from 'app/Utils';

import { styles, DetailStyle } from 'app/css';

export default class DetailsView extends Component
{
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);
    this.GPSManager = props.screenProps.GPSManager;
    this.state = {
      results: '',
    }
    this.location = props.navigation.state.params.location;
  }

  //<Button onPress={this.findRoute.bind(this)} title="Navigate Here!"></Button>
  //{this.state.results.results.name}
  render() {
    const position = this.GPSManager.getPosition();
    console.log(this.location);
    const feetAway = this.location.FeetAway(position);

    return (
      <View style={styles.container}>
        <View style={DetailStyle.titleSec}>
          {RenderIcon(this.location.category_id,'details')}
          <Text style={DetailStyle.title}>
            blah
          </Text>
        </View>
        <Text style={DetailStyle.dist}>
          {feetAway} feet away
        </Text>
      </View>
    );
  }
}
