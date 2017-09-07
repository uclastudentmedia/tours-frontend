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

const styles = require( "../../assets/css/style");

export default class DirectionsView extends Component
{
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    locations: [],
  };

  constructor(props){
    super(props);
    this.state = {
      directions: {},
    }
  }

  render() {
    const {
      startLocation,
      endLocation,
      directions,
    } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}> This is the Directions View </Text>

        <Text>{JSON.stringify(directions)}</Text>

        <Button
          title='Get Directions'
          onPress={this.getDirections.bind(this)}
        />

        <Text>From: {startLocation ? startLocation.name : ''}</Text>
        <Text>To: {endLocation ? endLocation.name : ''}</Text>


        <View style={{flexDirection: 'row', flex: 1}}>
          <SearchContainer style={{flexDirection: 'column'}}
          locations={this.props.locations}
          onResultSelect={this.setStartLocation.bind(this)}
          maxResults={5}
          />
          <SearchContainer style={{flexDirection: 'column'}}
          locations={this.props.locations}
          onResultSelect={this.setEndLocation.bind(this)}
          maxResults={5}
          />
        </View>

      </View>
    );
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
