'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';

import { Location } from 'app/DataTypes';
import GPSManager from 'app/GPSManager';
import { RenderIcon } from 'app/Utils';

import { styles, DetailStyle } from 'app/css';

export default class DetailsView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          title: PropTypes.string.isRequired,
          location: PropTypes.instanceOf(Location).isRequired,
        })
      })
    }),
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
  };

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
    console.log(this.location);
    const position = this.GPSManager.getPosition();

    return (
      <View style={styles.container}>
        <View style={DetailStyle.titleSec}>
          {RenderIcon(this.location.category_id,'details')}
          <Text style={DetailStyle.title}>
              {this.location.name}
          </Text>
        </View>
        <Text style={DetailStyle.dist}>
            {this.location.text_description}
        </Text>
      </View>
    );
  }
}
