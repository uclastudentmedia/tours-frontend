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
  SearchView,
  MainMapView,
} from 'app/Views';

import {
  DecodePolyline
} from 'app/Utils';

import GPSManager from 'app/GPSManager';
import {
  GetLocationList,
  RouteTBT,
} from 'app/DataManager';

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

    this.state = {
      error: null,
      dataSource: this.ds.cloneWithRows([]),
      loading: false,
    };
    this.locations = GetLocationList();
  }

  searchStartLocation = () => {
    this.props.navigation.navigate('Search', {
      onResultSelect: loc => this.setState({startLocation: loc}),
      title: "Select start location"
    });
  }

  searchEndLocation = () => {
    this.props.navigation.navigate('Search', {
      onResultSelect: loc => this.setState({endLocation: loc}),
      title: "Select end location"
    });
  }

  showRouteOnMap = () => {
    const {
      startLocation,
      endLocation
    } = this.state;

    let path = DecodePolyline(this.trip.legs[0].shape).map(coord => ({
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
    path = [].concat(startCoords, path, endCoords);

    PubSub.publish('DirectionsView.showRouteOnMap', {
      path: path,
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
    PubSub.publish('DirectionsView.showRouteOnMap', {}); // clear route info
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
