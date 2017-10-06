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
  TouchableHighlight,
  ActivityIndicator,
  Animated,
  Alert
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
const VISIBLE_PX = 0;

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
          this.setState({
            error: 'Unable to find your location.'
          });
          Alert.alert(this.state.error);
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
      this.setState({
        error: 'Indoor navigation not supported for this building.'
      });
      Alert.alert(this.state.error);
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


  showRouteOnMap = (startLocation, endLocation, polyline) => {

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

    PubSub.publish('DirectionsView.showRouteOnMap', {
      polyline: polylineCoords,
      startLocation: startLocation,
      endLocation: endLocation,
    });
    this.props.navigation.navigate('MainMap');
  }

  Clear = () => {
    this.setState({
      error: null,
      startLocation: null,
      endLocation: null,
      dataSource: this.ds.cloneWithRows([]),
    });
    this.startLocation = null;
    this.endLocation = null;
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

  SetVisible = (isVisible) => {
    const toValue = isVisible ? VISIBLE_PX : HIDDEN_PX;

    Animated.spring(this.state.translateYValue, {
      toValue: toValue,
      //velocity: 3,
      //tension: 2,
      //friction: 8
    }).start();
  }

  render() {
    const {
      startLocation,
      endLocation,
      error,
      loading,
      endRoom,
      translateYValue,
    } = this.state;

    return (
        
        /*
      <View>

        <Text style={styles.errorText}>{error}</Text>

        {this.renderSpinner()}

        <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
                <TouchableOpacity style={styles.wrapper}>
                    <View style={styles.wrapper}>
                        <Text style={[styles.baseText, styles.locText]}>
                          {rowData.instruction}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
        />
        */

        <Animated.View style={[styles.directionsBar, {top: translateYValue}]}>

          <TouchableHighlight
            style={[styles.directionsBtnTop, styles.directionsBtnColor]}
            onPress={this.searchStartLocation}
          >
            <Text style={styles.directionsText}>
              {startLocation ? startLocation.name : 'Search from'}
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.directionsBtnBot, styles.directionsBtnColor]}
            onPress={this.searchEndLocation}
          >
            <Text style={styles.directionsText}>
              {endLocation ? endLocation.name : 'Search destination'} {endRoom}
            </Text>
          </TouchableHighlight>

          { endLocation && endLocation.indoor_nav ?
            <TouchableHighlight
              style={[styles.directionsBtnBot, styles.directionsBtnColor]}
              onPress={this.selectEndRoom}
            >
              <Text style={styles.directionsText}>Select end room</Text>
            </TouchableHighlight>
          : null }

          {/*
          <View style={{marginBottom: 10}}>
            <View style={{marginTop: 10}}>
                <TouchableOpacity
                  onPress={this.getDirections.bind(this)}
                  style={styles.dirStartBtn}>
                    <MaterialsIcon color='#ffffff' size={40} name={'directions'}/>
                </TouchableOpacity>
            </View>
          </View>

          <Button
            title={"Clear"}
            onPress={this.Clear}
          />
          */}
        </Animated.View>

      //</View>
    );
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
        instruction: 'You have arrived at your destination.'
      }];
      this.setState({
        error: null,
        dataSource: this.ds.cloneWithRows(directions),
        loading: false,
      });
      this.showRouteOnMap(startLocation, endLocation, "");
      return;
    }

    // begin directions request
    this.setState({ loading: true });

    const extraOptions = {};

    RouteTBT(startLocation, endLocation, extraOptions)
      .then(data => {
        let error = data.error;
        let directions = [];
        let polyline = "";
        if (data && !data.error) {
          error = null;
          directions = data.trip.legs[0].maneuvers;
          polyline = data.trip.legs[0].shape;
          this.showRouteOnMap(startLocation, endLocation, polyline);
        }
        this.setState({
          error: error,
          dataSource: this.ds.cloneWithRows(directions),
          loading: false,
        });
        if(error)
            Alert.alert(error);
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false,
        });
        Alert.alert(error.message);
      });
  }
}
