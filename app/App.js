import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
const styles = require( "../assets/css/style");

export default class App extends Component {
  render() {
    const { region } = this.props;
    console.log(region);

    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={{
            latitude: 34.0689,
            longitude: -118.4452,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}>
        </MapView>
          <Text style={styles.description}>
              Description of location is here. Description of location is here. Description of location is here.
              Description of location is here. Description of location is here. Description of location is here.
              Description of location is here.
          </Text>
      </View>
    );
  }
}
