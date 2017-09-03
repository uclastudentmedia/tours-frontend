import React, { Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    ActivityIndicator,
    TouchableOpacity,
    Button
} from 'react-native';

import MainMapView from './MainMapView';

const styles = require("../../assets/css/style");

export default class LoadingView extends Component {

  constructor(props){
    super(props);
    this.state = {
      results: '',
      done: false,
    }
  }

  componentDidMount(){
    this.getAPIData();
  }

  getAPIData(){
    return fetch("https://tours.bruinmobile.com/api/landmark/")
      .then((response) => response.json())
      .then((responseJson) => {
        let results = this.formatData(responseJson.results);
        this.storeData(results);
        this.setState({
          results: results,
          done: true
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  formatData(results) {
    return results.map(landmark => {
      landmark.category_id = landmark.category_id || 1;

      return landmark;
    });
  }

  storeData(data){
      AsyncStorage.setItem('data', JSON.stringify(data));
  }

  gotoMapView(){
      console.log(this.props.navigator);
      this.props.navigator.push({
          id: 'MapView',
          name: 'MapView',
      });
  }

  render() {
    if(!this.state.done) {
      return (
            <Image
                style={styles.container}
                source={require('../../assets/images/logoArtboard.png')}>
              <ActivityIndicator
                color={'yellow'}
                size={'large'}
                style={styles.loading}
              />
            </Image>

      );
    }
    else {
      return(
            <Image
                style={styles.container}
                source={require('../../assets/images/logoArtboard.png')}>
              <View style={styles.loading}>
                <Button onPress={this.gotoMapView.bind(this)} title="Launch App"></Button>
              </View>
            </Image>

      );
    }
  }
}
