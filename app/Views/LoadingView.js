import React, { Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';

import MainMapView from './MainMapView';

const styles = require("../../assets/css/style");
const SIZES = ['small', 'normal', 'large'];

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      results: '',
      done: false,
      visible: true,
      visible: this.props.visible, 
      textContent: this.props.textContent
    }
  }

  static propTypes = {
    visible: React.PropTypes.bool,
    textContent: React.PropTypes.string,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOf(SIZES),
    overlayColor: React.PropTypes.string
  };

  static defaultProps = {
    visible: false,
    textContent: "",
    color: 'white',
    size: 'large', // 'normal',
    overlayColor: 'rgba(0, 0, 0, 0.25)',
  };

  componentDidMount(){
    this.getAPIData();
    setInterval(() => {
      this.setState({
        visible: !this.state.visible
      });
    }, 3000);
  }



  getAPIData(){
    return fetch("http://tours.bruinmobile.com/api/landmark/")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          results: responseJson
        });
        this.storeData();
        this.setState({
          done: false //make sure to change to true
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  storeData(){
      let data = this.state.results;
      AsyncStorage.setItem('data', JSON.stringify(data));
  }

  render() {
    if(!this.state.done) {
      return (
          <View style={styles.loading}>
              <Image
                  style={styles.loading_logo}
                  source={require('../../assets/images/logo_1x.png')}/>
              <Text style={styles.center}>BruinTours</Text>
              <ActivityIndicator
                color={'yellow'}
                size={'large'}
                style={styles.spin}
              />
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
