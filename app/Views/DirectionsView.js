'use strict';

/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ListView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PubSub from 'pubsub-js';

import {
  TBTItem,
} from 'app/Components';

import {
  DecodePolyline
} from 'app/Utils';

import GPSManager from 'app/GPSManager';
import {
  GetLocationList,
  GetLocationByName,
  RouteTBT,
} from 'app/DataManager';
import { Location } from 'app/DataTypes';

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

  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.GPSManager = props.screenProps.GPSManager;

    this.state = {
      error: null,
      dataSource: this.ds.cloneWithRows([]),
      loading: false,
    };

    this.locationNames = GetLocationList()
                            .sort((a,b) => a.priority - b.priority)
                            .map(loc => loc.name);
  }

  searchStartLocation = () => {
    const currentLocationText = 'Current Location';

    let onResultSelect = name => {
      let startLocation;
      if (name === currentLocationText) {
        const position = this.GPSManager.getPosition();
        //const position = { latitude: 34.070286, longitude: -118.443413 };
        if (!position) {
          this.setState({
            error: 'Unable to find your location.'
          });
          return;
        }

        startLocation = new Location({
          lat: position.latitude,
          long: position.longitude,
          name: currentLocationText,
          id: -12345, // unique id
        });
      } else {
        startLocation = GetLocationByName(name);
      }

      this.setState({
        startLocation: startLocation
      });
    };

    this.props.navigation.navigate('Search', {
      title: 'Select start location',
      data: this.locationNames,
      dataWithIcons: [{text: currentLocationText, icon: 'gps-fixed'}],
      onResultSelect: onResultSelect,
    });
  }

  searchEndLocation = () => {
    this.props.navigation.navigate('Search', {
      title: 'Select end location',
      data: this.locationNames,
      onResultSelect: name => this.setState({
        endLocation: GetLocationByName(name)
      }),
    });
  }

  showRouteOnMap = () => {
    const {
      startLocation,
      endLocation
    } = this.state;

    let polyline = DecodePolyline(this.trip.legs[0].shape).map(coord => ({
      latitude: coord[0],
      longitude: coord[1]
    }));

    const startCoords = {
      latitude: startLocation.lat,
      longitude: startLocation.long
    };
    const endCoords = {
      latitude: endLocation.lat,
      longitude: endLocation.long
    };

    // connect to the map icons
    polyline = [].concat(startCoords, polyline, endCoords);

    PubSub.publish('DirectionsView.showRouteOnMap', {
      polyline: polyline,
      startLocation: startLocation,
      endLocation: endLocation,
    });
    this.props.navigation.navigate('MainMap');
  }

  clear = () => {
    this.setState({
      error: null,
      startLocation: null,
      endLocation: null,
      dataSource: this.ds.cloneWithRows([]),
    });
    this.trip = null;
    PubSub.publish('DirectionsView.clearRoute');
  }

  renderSpinner = () => {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator
            color={'#246dd5'}
            size={'large'}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      startLocation,
      endLocation,
      error,
      loading,
    } = this.state;

    return (
      <View style={DirectionsStyle.container}>

        <Text style={styles.errorText}>{error}</Text>

        {this.renderSpinner()}

        <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
                <TouchableOpacity style={styles.wrapper}>
                    <View style={styles.wrapper}>
                        <Text style={[styles.baseText, styles.locText]}>
                          {rowData.verbal_pre_transition_instruction}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
        />

        { this.trip &&
            <Button
              title={"Show route on map"}
              onPress={this.showRouteOnMap}
            />
        }

        <Button
          title={"Select start location"}
          onPress={this.searchStartLocation}
        />

        <Button
          title={"Select end location"}
          onPress={this.searchEndLocation}
        />

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

        <Button
          title={"Clear"}
          onPress={this.clear}
        />

      </View>
    );
  }

  async getDirections() {
    const {
      startLocation,
      endLocation,
    } = this.state;

    if (!startLocation || !endLocation) {
      this.setState({
        error: 'Select a start and end location.'
      });
      return;
    }

    // begin directions request
    this.setState({ loading: true });

    const extraOptions = {};

    RouteTBT(startLocation, endLocation, extraOptions)
      .then(data => {
        let error = data.error;
        let directions = [];
        if (data && !data.error) {
          error = null;
          directions = data.trip.legs[0].maneuvers;
        }

        this.trip = data.trip;

        this.setState({
          error: error,
          dataSource: this.ds.cloneWithRows(directions),
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  }
}
