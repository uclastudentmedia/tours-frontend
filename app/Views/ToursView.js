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
  }

  gotoDescription(location) {
      this.props.navigation.navigate('TourDetails', {
          location: location,
      });
  }

  render() {
    return (
      <View style={styles.container}>

          <ListView
              enableEmptySections={true}
              removeClippedSubviews={false}
              dataSource={this.state.dataSource}
              renderRow={(loc) =>
                  <TouchableHighlight
                    underlayColor='#ddd'
                    onPress={this.gotoDescription.bind(this, loc)}
                    style={[styles.wrapper, styles.listItemBorder]}
                  >
                      <View style={styles.listItemContainer}>
                          <View style={styles.locListIcon}>
                            <Image source={GetIcon(loc.category_id)} />
                          </View>
                          <View style={styles.listItemText}>
                              <Text style={styles.baseText}>
                                  <Text style={styles.locText}>
                                      {loc.name}{'\n'}
                                  </Text>
                                  <Text style={styles.distText}>
                                      {DistanceAwayText(loc.FeetAway(position))}
                                  </Text>
                              </Text>
                          </View>
                      </View>
                  </TouchableHighlight>
              }
          />
      </View>
    );
  }
}
