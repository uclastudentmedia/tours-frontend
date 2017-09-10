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
    this.state = {
      results: '',
    }
    console.log(props);
    this.location = props.navigation.state.params.rowDat;
  }

  //<Button onPress={this.findRoute.bind(this)} title="Navigate Here!"></Button>
  //{this.state.results.results.name}
  render() {
    return (
      <View style={styles.container}>
        <View style={DetailStyle.titleSec}>
          {RenderIcon(this.location.category_id,'details')}
          <Text style={DetailStyle.title}>
            blah
          </Text>
        </View>
        <Text style={DetailStyle.dist}>
          {/*feetCalc(this.state.curLocation.latitude,
                    this.state.curLocation.longitude,
                    this.state.results.results.lat,
                    this.state.results.results.long)*/} feet away
        </Text>
      </View>
    );
  }
}
