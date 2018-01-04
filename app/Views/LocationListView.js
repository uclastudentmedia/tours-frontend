'use strict';

/**
 * Created by danielhuang on 9/1/17.
 */
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
import { GetLocationList } from 'app/DataManager';
import { popPrioritize, DistanceAwayText } from 'app/Utils';

import { GetIcon } from 'app/Assets';
import { styles } from 'app/css';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class LocationListView extends Component
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

      this.initialPosition = {
          latitude: 34.070286,
          longitude: -118.443413,
      };

      this.region = {
          latitude: 34.0700086,
          longitude: -118.446003,
          latitudeDelta: 0.03,
          longitudeDelta: 0.02,
      };

      this.locations = GetLocationList();

      this.categories = [
        { name: 'All', title: 'All' },
        { name: 'Parking', title: 'Parking' },
        { name: 'Food & Beverage', title: 'Food' },
        { name: 'Libraries', title: 'Library' },
      ];

      this.category = 'All';

      this.state = {
          dataSource: ds.cloneWithRows([]),
          position: this.initialPosition,
      };
  }
  componentDidMount() {
      this._isMounted = true;
      this.getPosition();
      this.updateLocations();

      PubSub.subscribe('MainMapView.onRegionChange', (msg, region) => {
        this.region = region;
        this.updateLocations();
      });
  }

  getPosition() {
      this.watchID = this.GPSManager.watchPosition(() => {
          if (this._isMounted) {
              this.setState({
                  position: this.GPSManager.getPosition()
              });
          }
      });
  }

  componentWillUnmount(){
      this._isMounted = false;
      this.GPSManager.clearWatch(this.watchID);
  }

  updateLocations(){
      //Get list of top locations
      let results = popPrioritize(this.region, this.category);

      results = results.slice(0, 20);

      this.setState({
        dataSource: ds.cloneWithRows(results),
      });
  }

  setCategory(category) {
      this.category = category;
      this.updateLocations();
  }

  gotoDescription(location) {
      this.props.navigation.navigate('Details', {
          location: location,
      });
  }

  render() {
    const {
      position
    } = this.state;

    return (
      <View style={styles.container}>
          <View style={styles.categoryFilterBtns}>
            {
              this.categories.map((cat, i) => (
                <View style={styles.buttonContainer} key={i}>
                  <Button
                    onPress={this.setCategory.bind(this, cat.name)}
                    title={cat.title}
                    color={this.category == cat.name ? '#f8d106' : '#f89406'}
                  />
                </View>
              ))
            }
          </View>

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
