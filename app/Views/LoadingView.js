import React, { Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import MainMapView from './MainMapView';

const styles = require("../../assets/css/style");

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      results: '',
      done: false
    }
  }

  componentDidMount(){
    this.getAPIData();
  }

  getAPIData(){
    return fetch("http://tours.bruinmobile.com/api/landmark/")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          results: responseJson
        });
        this.setState({
          done: true
        });
        console.log(this.state);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if(!this.state.done) {
      return (
        <View style={styles.container}>
          <Text>Loading ... </Text>
        </View>
      );
    }
    else {
      return(
        <View style={styles.container}>
          <MainMapView/>
        </View>
      );
    }
  }
}
