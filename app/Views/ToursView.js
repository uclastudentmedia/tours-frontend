'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
} from 'react-native';

import GPSManager from 'app/GPSManager';
import { GetTourList } from 'app/DataManager';
import { ToursStyle as styles } from 'app/css';

export default class ToursView extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.tours = GetTourList();
  }

  componentDidMount() {
    //this.gotoDescription(this.tours[2]);
  }

  gotoDescription = (tour) => {
    this.props.navigation.navigate('ToursDetail', {
      tour: tour
    });
  }

  render() {
    return (
      <View style={[styles.container, styles.statusBar]}>
        {this.tours.map(tour => (
          <TouchableHighlight key={tour.id} underlayColor='#ddd'
            style={styles.listItemContainer}
            onPress={() => this.gotoDescription(tour)}
          >
            <View style={StyleSheet.absoluteFill}>
              <Image style={StyleSheet.absoluteFill} source={{uri: tour.image}}/>
              <Text style={styles.nameText}>{tour.name}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    );
  }
}
