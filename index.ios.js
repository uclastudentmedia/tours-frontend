import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import App from './app/App';

export default class toursfrontend extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <App/>
      </View>
    );
  }
}

AppRegistry.registerComponent('toursfrontend', () => toursfrontend);
