'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Animated,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import PubSub from 'pubsub-js';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import {
  DecodePolyline,
  GetCurrentLocationObject,
} from 'app/Utils';

import GPSManager from 'app/GPSManager';
import {
  GetLocationList,
  GetIndoorBuildingById,
  GetLocationByName,
  RouteTBT,
  RouteIndoor,
} from 'app/DataManager';

import {
  styles,
} from 'app/css';

const HIDDEN_PX = -300;
const VISIBLE_PX = Platform.select({
  android: -10,
  ios: 0,
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
        startLocation = GetCurrentLocationObject(position);
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
      title: 'Select destination',
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
      title: 'Select room',
      data: building.pois,
      onResultSelect: name => {
        this.setState({
          endRoom: name,
        });
        this.endRoom = name;
      }
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
    this.endRoom = null;
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

  SetInput = ({startLocation, endLocation, endRoom}) => {
    if (startLocation) {
      this.startLocation = startLocation;
    }
    if (endLocation) {
      this.endLocation = endLocation;
    }
    if (endRoom) {
      // validate input
      const building = GetIndoorBuildingById(endLocation.id);
      if (building && building.pois.includes(endRoom)) {
        this.endRoom = endRoom;
      }
      else {
        console.warn('invalid room');
      }
    }

    this.setState({
      startLocation: this.startLocation,
      endLocation: this.endLocation,
      endRoom: this.endRoom,
    });
    this.getDirections();
  }

  getDirections = () => {
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

  getIndoorDirections = () => {
    const endLocation = this.endLocation;
    const endRoom = this.endRoom;

    if (!endRoom) {
      Alert.alert('Select a room first.');
      return;
    }

    RouteIndoor(endLocation.id, endRoom, endRoom)
      .then(data => {
        this.props.navigation.navigate('Image', {
          images: data.images,
          title: endLocation.name,
        });
      })
      .catch(error => Alert.alert(error.message));
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
          style={styles.directionsBtn}
          underlayColor={underlayColor}
          onPress={this.searchStartLocation}
        >
          <Text style={styles.directionsText}>
            {startLocation ? startLocation.name : 'Select start location'}
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.directionsBtn}
          underlayColor={underlayColor}
          onPress={this.searchEndLocation}
        >
          <Text style={styles.directionsText}>
            {endLocation ? endLocation.name : 'Select destination'}
          </Text>
        </TouchableHighlight>

        { endLocation && endLocation.indoor_nav ?
          <View style={styles.flexRow}>
            <TouchableHighlight
              style={styles.directionsBtn}
              underlayColor={underlayColor}
              onPress={this.selectEndRoom}
            >
              <Text style={styles.directionsText}>
                {endRoom || 'Select room'}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.directionsBtnIcon}
              underlayColor={underlayColor}
              onPress={this.getIndoorDirections}
            >
              <MaterialsIcon color='#ffffff' size={28} name={'directions'}/>
            </TouchableHighlight>
          </View>
        : null }

      </Animated.View>
    );
  }
}
