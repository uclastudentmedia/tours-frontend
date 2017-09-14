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
  Button
} from 'react-native';
import { initializeParameters, popLocationListView, setCategory } from 'app/LocationPopManager'
import GPSManager from 'app/GPSManager';
import { GetLocationList } from 'app/DataManager';
import {popPrioritize, RenderIcon} from 'app/Utils'

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

      this.initialRegion = {
          latitude: 34.070286,
          longitude: -118.443413,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.0345,
      };

      this.locations = GetLocationList();

      this.state = {
          dataSource: ds.cloneWithRows([]),
          markers: [],
          position: this.initialPosition,
          region: this.initialRegion,
          results: []
      };
      console.log(this.state);
  }
  componentDidMount() {
      this.getPosition();
      this.getLocations('All');
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
      console.log("hi");
      console.log(this.locations);
      //Get list of top 10 locations
      //edit: need to change to current gps location, NOT initial position
      let results = popPrioritize(this.state.region, category);

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
          <Button
              onPress={this.getLocations("Food")}
              title="Learn More"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
          />
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
