import React, { Component } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    Button
} from 'react-native';

import { GetLandmarkList } from 'app/DataManager';

const styles = require("../../assets/css/style");

export default class LoadingView extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getAPIData();
  }

  getAPIData() {
    GetLandmarkList()
      .then(this.gotoMapView.bind(this))
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
