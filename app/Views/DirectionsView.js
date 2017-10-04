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
  GetIndoorBuildingById,
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
      endLocation: null,
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
        endLocation: GetLocationByName(name),
        endRoom: null,
      }),
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


  showRouteOnMap = () => {
    const {
      startLocation,
      endLocation,
      polyline,
    } = this.state;

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
    polylineCoords = [].concat(startCoords, polyline, endCoords);

    PubSub.publish('DirectionsView.showRouteOnMap', {
      polyline: polylineCoords,
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
      polyline: null,
    });
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
      endRoom,
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
                          {rowData.instruction}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
        />

        <View style={styles.directionsBar}>

          <TouchableHighlight
            style={styles.directionsBtnTop}
            onPress={this.searchStartLocation}
          >
            <Text style={styles.directionsText}>Search from</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.directionsBtnBot}
            onPress={this.searchEndLocation}
          >
            <Text style={styles.directionsText}>Search destination</Text>
          </TouchableHighlight>

          { endLocation && endLocation.indoor_nav ?
            <TouchableHighlight
              style={styles.directionsBtnBot}
              onPress={this.selectEndRoom}
            >
              <Text style={styles.directionsText}>Select end room</Text>
            </TouchableHighlight>
          : null }
          <View style={{marginBottom: 10}}>
            <Text>From: {startLocation ? startLocation.name : ''}</Text>
            <Text>To: {endLocation ? endLocation.name : ''} {endRoom}</Text>
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

    // same start and end location
    if (startLocation.id === endLocation.id) {
      const directions = [{
        instruction: 'You have arrived at your destination.'
      }];
      this.setState({
        error: null,
        dataSource: this.ds.cloneWithRows(directions),
        loading: false,
        polyline: "",
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
        let polyline = "";
        if (data && !data.error) {
          error = null;
          directions = data.trip.legs[0].maneuvers;
          polyline = data.trip.legs[0].shape;
        }

        this.showRouteOnMap();

        this.setState({
          error: error,
          dataSource: this.ds.cloneWithRows(directions),
          polyline: polyline,
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
