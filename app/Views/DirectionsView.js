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

import {
  TBTItem,
} from 'app/Components';

import {
  SearchView,
} from 'app/Views';

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

      </View>
    );
  }

  async getDirections() {
    const {
      startLocation,
      endLocation,
    } = this.state;

    if (!startLocation || !endLocation) {
      return console.log('getDirections: start/end location not selected');
    }

    // begin directions request
    this.setState({ loading: true });
    console.log('start');

    const extraOptions = {};

    RouteTBT(startLocation, endLocation, extraOptions)
      .then(data => {
        let error = data.error;
        let directions = [];
        if (data && !data.error) {
          error = null;
          directions = data.trip.legs[0].maneuvers;
        }

        this.setState({
          error: error,
          dataSource: this.ds.cloneWithRows(directions),
          loading: false,
        });
        console.log('done');
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false,
        });
      });
  }
}
