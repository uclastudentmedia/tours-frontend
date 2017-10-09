'use strict';

/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Animated,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import PubSub from 'pubsub-js';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import {
  TBTItem,
} from 'app/Components';

import {
  DecodePolyline
} from 'app/Utils';

import GPSManager from 'app/GPSManager';
import {
  GetLocationList,
  GetIndoorBuildingById,
  GetLocationByName,
  RouteTBT,
} from 'app/DataManager';
import { Location } from 'app/DataTypes';

import {
  styles,
  DirectionsStyle
} from 'app/css';

const HIDDEN_PX = -300;
const VISIBLE_PX = Platform.select({
  android: -20,
  ios: -10,
});

export default class DirectionsBar extends Component
{

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
  };

  constructor(props){
    super(props);

    this.GPSManager = props.screenProps.GPSManager;

    this.state = {
      startLocation: null,
      endLocation: null,
      translateYValue: new Animated.Value(HIDDEN_PX),
    };

    this.startLocation = null;
    this.endLocation = null;

    this.locationNames = GetLocationList()
                            .sort((a,b) => a.priority - b.priority)
                            .map(loc => loc.name);
  }

  searchStartLocation = () => {
    const currentLocationText = 'Current Location';

    const onResultSelect = name => {
      let startLocation;
      if (name === currentLocationText) {
        const position = this.GPSManager.getPosition();
        //const position = { latitude: 34.070286, longitude: -118.443413 };
        if (!position) {
          Alert.alert('Unable to find your location.');
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
      this.startLocation = startLocation;
      this.getDirections();
    };

    this.props.navigation.navigate('Search', {
      title: 'Select start location',
      data: this.locationNames,
      dataWithIcons: [{text: currentLocationText, icon: 'gps-fixed'}],
      onResultSelect: onResultSelect,
    });
  }

  searchEndLocation = () => {
    const onResultSelect = name => {
      const endLocation = GetLocationByName(name);
      this.setState({
        endLocation: endLocation,
        endRoom: null,
      }),
      this.endLocation = endLocation;
      this.getDirections();
    };

    this.props.navigation.navigate('Search', {
      title: 'Select end location',
      data: this.locationNames,
      onResultSelect: onResultSelect
    });
  }

  selectEndRoom = () => {
    const {
      endLocation
    } = this.state;
    if (!endLocation) {
      return;
    }

    let building = GetIndoorBuildingById(endLocation.id);
    if (!building) {
      Alert.alert('Indoor navigation not supported for this building.');
      return;
    }
    this.props.navigation.navigate('Search', {
      title: 'Select end room',
      data: building.pois,
      onResultSelect: name => this.setState({
        endRoom: name,
      })
    });
    }


  showRouteOnMap = (startLocation, endLocation, polyline, minutes, miles, maneuvers) => {

    let polylineCoords = DecodePolyline(polyline).map(coord => ({
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
    polylineCoords = [].concat(startCoords, polylineCoords, endCoords);

    PubSub.publish('DirectionsBar.showRouteOnMap', {
      polyline: polylineCoords,
      startLocation: startLocation,
      endLocation: endLocation,
      minutes: minutes,
      miles: miles,
      maneuvers: maneuvers,
    });
  }

  Clear = () => {
    this.setState({
      startLocation: null,
      endLocation: null,
    });
    this.startLocation = null;
    this.endLocation = null;
  }

  SetVisible = (isVisible) => {
    const toValue = isVisible ? VISIBLE_PX : HIDDEN_PX;

    Animated.spring(this.state.translateYValue, {
      toValue: toValue,
      //velocity: 3,
      //tension: 2,
      //friction: 8
    }).start();
  }

  async getDirections() {
    const startLocation = this.startLocation;
    const endLocation = this.endLocation;

    if (!startLocation || !endLocation) {
      // don't get directions until we have all valid input
      return;
    }

    // same start and end location
    if (startLocation.id === endLocation.id) {
      const directions = [{
        instruction: 'You have arrived at your destination.',
        type: 4,
      }];
      this.showRouteOnMap(startLocation, endLocation, "", 0, 0, directions);
      return;
    }

    // begin directions request

    const extraOptions = {};

    RouteTBT(startLocation, endLocation, extraOptions)
      .then(data => {
        if (!data) {
          return;
        }
        if (!data.error) {
          let leg = data.trip.legs[0];
          let maneuvers = leg.maneuvers;
          let polyline = leg.shape;
          let minutes = leg.summary.time / 60;
          let miles = leg.summary.length;

          this.showRouteOnMap(startLocation, endLocation, polyline,
                              minutes, miles, maneuvers);
        } else {
            Alert.alert(data.error);
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  }

  render() {
    const {
      startLocation,
      endLocation,
      endRoom,
      translateYValue,
    } = this.state;

    const underlayColor = StyleSheet.flatten(styles.directionsBtnPressedColor).backgroundColor;

    return (
      <Animated.View style={[styles.directionsBar, {top: translateYValue}]}>

        <TouchableHighlight
          style={[styles.directionsBtnTop, styles.directionsBtnColor]}
          underlayColor={underlayColor}
          onPress={this.searchStartLocation}
        >
          <Text style={styles.directionsText}>
            {startLocation ? startLocation.name : 'Search from'}
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[styles.directionsBtnBot, styles.directionsBtnColor]}
          underlayColor={underlayColor}
          onPress={this.searchEndLocation}
        >
          <Text style={styles.directionsText}>
            {endLocation ? endLocation.name : 'Search destination'} {endRoom}
          </Text>
        </TouchableHighlight>

        { endLocation && endLocation.indoor_nav ?
          <TouchableHighlight
            style={[styles.directionsBtnBot, styles.directionsBtnColor]}
            underlayColor={underlayColor}
            onPress={this.selectEndRoom}
          >
            <Text style={styles.directionsText}>Select end room</Text>
          </TouchableHighlight>
        : null }

      </Animated.View>
    );
  }
}
