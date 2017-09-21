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

import { initializeParameters, popLocationListView, setCategory } from 'app/LocationPopManager'
import GPSManager from 'app/GPSManager';
import { GetLocationList } from 'app/DataManager';
import {popPrioritize} from 'app/Utils'

import { GetIcon } from 'app/Assets';
import { styles } from 'app/css';

var initialPosition = {coords: {latitude: 34.070286, longitude: -118.443413}};
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

      this.category = 'All';

      this.state = {
          dataSource: ds.cloneWithRows([]),
          position: this.initialPosition,
      };
  }
  componentDidMount() {
      this.getPosition();
      this.getLocations(this.category);

      PubSub.subscribe('MainMapView.onRegionChange', (msg, region) => {
        this.region = region;
        this.getLocations(this.category);
      });
  }

  getPosition() {
      this.watchID = this.GPSManager.watchPosition(() => {
          this.setState({
            position: this.GPSManager.getPosition()
          });
      });
  }

  componentWillUnmount(){
      this.GPSManager.clearWatch(this.watchID);
  }

  getLocations(category){
      //Get list of top 10 locations
      let results = popPrioritize(this.region, category);

      results = results.slice(0, 10);

      this.setState({
        dataSource: ds.cloneWithRows(results),
      });
  }

  gotoDescription(location) {
      this.props.navigation.navigate('Details', {
          location: location,
      });
  }
//this.getLocations.bind(this,"Food")
  render() {
    //make modules into ListView, each module will have an id, based on which
    //id, the ListView will render that module
    const position = this.GPSManager.getPosition();

    return (
      <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.buttonContainer}>
              <Button
                onPress={this.getLocations.bind(this,"All")}
                title="All"
                color="#F89406"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                  onPress={this.getLocations.bind(this,"Parking")}
                  title="Parking"
                  color="#F89406"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                  onPress={this.getLocations.bind(this,"Food & Beverage")}
                  title="Food"
                  color="#F89406"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                  onPress={this.getLocations.bind(this,"Libraries")}
                  title="Library"
                  color="#F89406"
              />
            </View>
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
                          <Image
                            style={styles.locListIcon}
                            source={GetIcon(loc.category_id)}
                          />
                          <View style={styles.listItemText}>
                              <Text style={styles.baseText}>
                                  <Text style={styles.locText}>
                                      {loc.name}{'\n'}
                                  </Text>
                                  <Text style={styles.distText}>
                                      {loc.FeetAway(this.position)} feet away
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
