'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ListView,
  TouchableHighlight,
  Button,
  Image,
} from 'react-native';
import PubSub from 'pubsub-js';

import GPSManager from 'app/GPSManager';

import { GetTBTIcon } from 'app/Assets';
import { styles } from 'app/css';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ToursView extends Component
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
          dataSource: ds.cloneWithRows([]),
      };

      PubSub.subscribe('DirectionsBar.showRouteOnMap', (msg, {maneuvers}) => {
          this.setState({
              dataSource: ds.cloneWithRows(maneuvers)
          });
      });
  }

  renderRow = (maneuver) => {
    return (
      <TouchableHighlight
        underlayColor='#ddd'
        onPress={() => {}}
        style={[styles.wrapper, styles.listItemBorder]}
      >
        <View style={styles.listItemContainer}>
          <View style={styles.locListIcon}>
            <Image source={GetTBTIcon(maneuver.type)} />
          </View>
          <View style={styles.listItemContainer}>
              <Text>{maneuver.instruction}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>

          <ListView
              enableEmptySections={true}
              removeClippedSubviews={false}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
          />
      </View>
    );
  }
}
