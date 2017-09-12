/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';

import {
  TBTItem,
  SearchContainer,
} from 'app/Components';

import { GetLandmarkList } from 'app/DataManager';


import Hr from 'react-native-hr';
const dirStyles = require( "../../assets/css/directionsStyle");

import { styles } from 'app/css';



export default class DirectionsView extends Component
{
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props){
    super(props);
    this.state = {
      directions: {},
      locations: [],
    }
  }

  componentDidMount() {
    GetLandmarkList()
      .then(locations => {
        this.setState({locations});
      })
      .catch(console.error);
  }

  render() {
    const {
      locations,
      startLocation,
      endLocation,
      directions,
    } = this.state;

    if (locations.length == 0) {
      return (
        <View style={styles.container}></View>
      );
    }
    else {
      return (
        <View style={styles.dirContainer}>

          <Text>{JSON.stringify(directions)}</Text>

          <Text style={{textAlign: 'center', fontWeight: 'bold', marginBottom: 10}}>Start Location</Text>
          <View style={dirStyles.search}>
            <SearchContainer style={{marginTop: 200, flexDirection: 'column'}}
            locations={locations}
            onResultSelect={this.setStartLocation.bind(this)}
            maxResults={3}
            />

            <Hr lineColor='#b3b3b3' />

            <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>End Location</Text>
            <SearchContainer style={{marginTop: 10, flexDirection: 'column'}}
            locations={locations}
            onResultSelect={this.setEndLocation.bind(this)}
            maxResults={3}
            />
          </View>

          <Text>From: {startLocation ? startLocation.name : ''}</Text>
          <Text>To: {endLocation ? endLocation.name : ''}</Text>

          <Button
            title='Get Directions'
            onPress={this.getDirections.bind(this)}
          />

        </View>
      );
    }
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
