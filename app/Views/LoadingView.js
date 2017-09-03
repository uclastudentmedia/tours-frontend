import React, { Component } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    Button
} from 'react-native';

import { GetLandmarkList } from '../DataManager';

const styles = require("../../assets/css/style");

export default class LoadingView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
  }

  componentDidMount() {
    this.getAPIData();
  }

  getAPIData() {
    GetLandmarkList()
      .then(() => {
        this.setState({
          done: true
        });
      })
      .catch(console.error);
  }

  gotoMapView() {
    console.log(this.props.navigator);
    this.props.navigator.push({
      id: 'MapView',
      name: 'MapView'
    });
  }

  render() {
    let button = null;
    if (this.state.done) {
      button = (
          <Button
            onPress={this.gotoMapView.bind(this)}
            title="Launch App"
            />
      );
    } else {
      button = (
          <ActivityIndicator
                color={'yellow'}
                size={'large'}
               />
      );
    }

    return (
        <Image style={styles.container}
               source={require('../../assets/images/logoArtboard.png')}>
          <View style={styles.loading}>
            {button}
          </View>
        </Image>
    );
  }
}
