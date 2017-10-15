import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import App from './app/App';

// disable console.log in release
if (!__DEV__) {
  console.log = () => {};
}

export default class UCLAMaps extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <App/>
      </View>
    );
  }
}

AppRegistry.registerComponent('UCLAMaps', () => UCLAMaps);
