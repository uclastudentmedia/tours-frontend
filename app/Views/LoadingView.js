import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    Button
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import { GetLandmarkList } from 'app/DataManager';

import { styles } from 'app/css';

import { logoArtboard } from 'app/Assets';

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
    await GetLandmarkList();
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
             source={logoArtboard}>
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
