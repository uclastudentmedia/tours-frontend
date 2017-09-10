'use strict';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    Button
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import { GetLocationList } from 'app/DataManager';

const styles = require("../../assets/css/style");

export default class LoadingView extends Component {
  static propTypes = {
    onLoadComplete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initializeApp();
  }

  initializeApp() {
    const {
      onLoadComplete,
    } = this.props;

    Promise.all([
      this.getAPIData(),
      //this.testDelay(),
    ]).then(onLoadComplete)
      .catch(console.error);
  }

  async getAPIData() {
    await GetLocationList();
  }

  // create 5 second artificial loading time
  async testDelay() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }

  render() {
    return (
      <Image style={styles.container}
             source={require('../../assets/images/logoArtboard.png')}>
        <View style={styles.loading}>
          <ActivityIndicator
            color={'yellow'}
            size={'large'}
          />
        </View>
      </Image>
    );
  }
}
