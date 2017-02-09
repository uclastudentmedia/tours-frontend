import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import LoadingView from './Views/LoadingView';
const styles = require( "../assets/css/style");

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
          <LoadingView></LoadingView>
      </View>
    );
  }
}
