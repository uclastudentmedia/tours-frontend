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


let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
    this.state = {
      directions: {},
      dataSource: ds.cloneWithRows([]),
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

  render() {
    const {
      startLocation,
      endLocation,
      directions,
    } = this.state;

    return (
      <View style={DirectionsStyle.container}>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
                <TouchableOpacity style={styles.wrapper}>
                    <View style={styles.wrapper}>
                      <Text style={styles.baseText}>
                        <Text style={styles.locText}>
                          {rowData.verbal_pre_transition_instruction}
                        </Text>
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

    const extraOptions = {};

    RouteTBT(startLocation, endLocation, extraOptions)
      .then(data => this.setState({
          directions: data.trip.legs[0].maneuvers,
          dataSource: ds.cloneWithRows(data.trip.legs[0].maneuvers)
      }))
      .catch(console.error);
      console.log(this.state.directions);
  }
}
