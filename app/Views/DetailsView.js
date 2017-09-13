'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';

import { Location } from 'app/DataTypes';
import GPSManager from 'app/GPSManager';
import { RenderIcon } from 'app/Utils';

import { logo } from 'app/Assets';
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

    if (this.location.images.length != 0) {
      this.displayImage = { uri: this.location.images[0].display };
    }
    else {
      this.displayImage = logo;
    }
  }

  //<Button onPress={this.findRoute.bind(this)} title="Navigate Here!"></Button>
  //{this.state.results.results.name}
  render() {
    console.log(this.location);
    const position = this.GPSManager.getPosition();

    return (
      <ScrollView>
        <View style={styles.container}>

          <View style={DetailStyle.titleSec}>
            {RenderIcon(this.location.category_id,'details')}
            <Text style={DetailStyle.title}>
                {this.location.name}
            </Text>
          </View>

          <Image
            source={this.displayImage}
            style={DetailStyle.displayImage}
          />

          <Text style={DetailStyle.dist}>
              {this.location.FeetAway(position)} feet away
          </Text>

          <Text style={DetailStyle.description}>
              {this.location.text_description}
          </Text>

{/*
          {this.location.images.map((image, idx) => (
            <Image
              key={idx}
              source={{uri: image.thumbnail}}
              style={DetailStyle.thumbnailImage}
            />
           ))}
*/}
        </View>
      </ScrollView>
    );
  }
}
