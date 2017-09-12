'use strict';

/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';

import Hr from 'react-native-hr';

import {
  TBTItem,
  SearchContainer,
} from 'app/Components';

import GPSManager from 'app/GPSManager';
import { GetLocationList } from 'app/DataManager';

import {
  styles,
  DirectionsStyle
} from 'app/css';



export default class DirectionsView extends Component
{
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
  };

  static defaultProps = {
  };

  constructor(props){
    super(props);
    this.state = {
      directions: {},
    };
    this.locations = GetLocationList();
  }

  render() {
    const {
      startLocation,
      endLocation,
      directions,
    } = this.state;

    return (
      <View style={DirectionsStyle.container}>

        <Text>{JSON.stringify(directions)}</Text>

        <Text style={{textAlign: 'center', fontWeight: 'bold', marginBottom: 10}}>Start Location</Text>
        <View style={DirectionsStyle.search}>
          <SearchContainer style={{marginTop: 10, flexDirection: 'column'}}
            locations={this.locations}
            onResultSelect={this.setStartLocation.bind(this)}
            maxResults={3}
          />

          <Hr lineColor='#b3b3b3' />

          <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>End Location</Text>
          <SearchContainer style={{marginTop: 10, flexDirection: 'column'}}
            locations={this.locations}
            onResultSelect={this.setEndLocation.bind(this)}
            maxResults={3}
          />
        </View>

        <View style={{marginBottom: 10}}> 
          <Text>From: {startLocation ? startLocation.name : ''}</Text>
          <Text>To: {endLocation ? endLocation.name : ''}</Text>
          <View style={{marginTop: 10}}>
            <Button
              title='Get Directions'
              onPress={this.getDirections.bind(this)}
            />
          </View>
        </View>

      </View>
    );
  }

  setStartLocation(result) {
    this.setState({
      startLocation: result
    });
  }

  setEndLocation(result) {
    this.setState({
      endLocation: result
    });
  }

  async getDirections() {
    const {
      startLocation,
      endLocation,
    } = this.state;

    if (!startLocation || !endLocation) {
      return console.log('getDirections: start/end location not selected');
    }

    const extraOptions = {};

    RouteTBT(startLocation, endLocation, extraOptions)
      .then(data => this.setState({directions: data}))
      .catch(console.error);
  }
}
