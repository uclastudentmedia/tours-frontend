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

const styles = require( "../../assets/css/style");


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
        <View style={styles.container}>

          <Text>{JSON.stringify(directions)}</Text>

          <Button
            title='Get Directions'
            onPress={this.getDirections.bind(this)}
          />

          <Text>From: {startLocation ? startLocation.name : ''}</Text>
          <Text>To: {endLocation ? endLocation.name : ''}</Text>


          <View style={{flexDirection: 'column', flex: 1}}>
            <SearchContainer style={{flexDirection: 'column'}}
            locations={locations}
            onResultSelect={this.setStartLocation.bind(this)}
            maxResults={5}
            title="Start"
            />
            <SearchContainer style={{flexDirection: 'column'}}
            locations={locations}
            onResultSelect={this.setEndLocation.bind(this)}
            maxResults={5}
            />
          </View>

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
