'use strict';

/**
 * Created by danielhuang on 9/1/17.
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ListView,
  TouchableOpacity,
} from 'react-native';
import PubSub from 'pubsub-js';

import GPSManager from 'app/GPSManager';
import { GetLocationList } from 'app/DataManager';
import {popPrioritize, RenderIcon} from 'app/Utils'

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
          id: 'Details',
          title: location.name,
          location: location,
      });
  }

  render() {
    //make modules into ListView, each module will have an id, based on which
    //id, the ListView will render that module
    const position = this.GPSManager.getPosition();

    return (
      <View style={styles.container}>
          <ListView
              enableEmptySections={true}
              removeClippedSubviews={false}
              dataSource={this.state.dataSource}
              renderRow={(loc) =>
                <TouchableOpacity onPress={this.gotoDescription.bind(this, loc)} style={styles.wrapper}>
                    <View style={styles.wrapper}>
                      {RenderIcon(loc.category_id)}
                      <Text style={styles.baseText}>
                        <Text style={styles.locText}>
                          {loc.name}{'\n'}
                          <Text style={styles.distText}>
                            {loc.FeetAway(position)} feet away
                          </Text>
                        </Text>
                      </Text>
                    </View>
                </TouchableOpacity>
              }
          />
      </View>
    );
  }
}
