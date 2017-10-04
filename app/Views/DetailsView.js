'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Button,
  Dimensions,
} from 'react-native';
import PubSub from 'pubsub-js';

import { Location } from 'app/DataTypes';
import GPSManager from 'app/GPSManager';

import { GetIcon, logo } from 'app/Assets';
import { DetailStyle } from 'app/css';

var {height, width} = Dimensions.get('window');

export default class DetailsView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          location: PropTypes.instanceOf(Location).isRequired,
          goBackFrom: PropTypes.string,
        })
      })
    }),
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.location.name}`,
  });

  constructor(props) {
    super(props);
    this.GPSManager = props.screenProps.GPSManager;
    this.state = {
      results: '',
    }
    this.location = props.navigation.state.params.location;
    this.goBackFrom = props.navigation.state.params.goBackFrom;

    if (this.location.images.length != 0) {
        if(width >= 700)
        {
            this.displayImage = { uri: this.location.images[0].original }
        }
        else
        {
            this.displayImage = { uri: this.location.images[0].display };
        }
    }
    else {
      this.displayImage = logo;
    }
  }

  showLocationOnMap = () => {
    PubSub.publish('DetailsView.showLocationOnMap', this.location);

    this.props.navigation.goBack(this.goBackFrom || null);

    // https://github.com/react-community/react-navigation/issues/1127
    setTimeout(() => {
      this.props.navigation.navigate('MainMap');
    }, 0);
  }

  //<Button onPress={this.findRoute.bind(this)} title="Navigate Here!"></Button>
  //{this.state.results.results.name}
  render() {
    console.log(this.location);
    const position = this.GPSManager.getPosition();

    return (
      <ScrollView contentContainerStyle={{flex:0}}>
        <View style={DetailStyle.container}>

          <View style={DetailStyle.titleSec}>
            <Image style={DetailStyle.icon}
              source={GetIcon(this.location.category_id)}/>
            <Text style={DetailStyle.title}>
                {this.location.name}
            </Text>
          </View>

          <Image
            source={this.displayImage}
            style={DetailStyle.displayImage}
          />

          <Text style={DetailStyle.dist}>
              {Math.ceil(this.location.FeetAway(position)/264)} walking minutes away
          </Text>

          <Button title='Show on map' onPress={this.showLocationOnMap} />

          <View style={{flex: 1}}>
              <Text style={DetailStyle.description}>
                  {this.location.text_description}
              </Text>
          </View>

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
