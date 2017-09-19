'use strict';

import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    Text,
} from 'react-native';

import { LoadAllData } from 'app/DataManager';

import { styles } from 'app/css';

import { logoArtboard } from 'app/Assets';

export default class LoadingView extends Component {
  static propTypes = {
    onLoadComplete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.TIMEOUT = 15 * 1000; // 15 seconds

    this.state = {};
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
      .catch(() => {}); // should never fail, only retry
  }

  async getAPIData() {
    /**
     * Load the data from the server. If the requests time out, resend the
     * requests (individual API requests are cached when they succeed).
     */

    return new Promise((resolve, reject) => {
      var done = false;
      var firstTry = true;

      const tryToLoad = () => {
        if (done) {
          return;
        }
        if (!firstTry) {
          this.setState({
            error: 'Network connection timed out. Retrying...'
          });
        }

        firstTry = false;

        //this.testRetry()
        LoadAllData()
          .then(() => {
            done = true;
            resolve();
          })
          .catch(error => {
            this.setState({
              error: (error.message || error) + '. Retrying...',
            })
          });

        // if network request times out, retry
        if (!done) {
          setTimeout(tryToLoad, this.TIMEOUT);
        }
      };

      tryToLoad();
    });
  }

  // create 5 second artificial loading time
  async testDelay() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }

  // fail 5 times then succeed
  async testRetry() {
    var counter = 0;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (counter++ < 5)
          resolve();
        else
          reject();
      }, 2000);
    });
  }

  render() {
    return (
      <Image style={styles.container} source={logoArtboard}>
        <View style={styles.loading}>
          <ActivityIndicator color={'yellow'} size={'large'} />
        </View>
        <Text style={styles.warningText}>{this.state.error}</Text>
      </Image>
    );
  }
}
