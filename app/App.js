import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';

import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator } from 'react-navigation';

import {
  LoadingView,
  MainMapView,
  LocationListView,
  DetailsView,
  DirectionsView,
} from 'app/Views';

import styles from '../assets/css/App';


function makeIcon(name) {
  /**
   * Helper function to generate tab icons
   * @param name string the name of the icon
   */
  const iconSize = 24;

  return ({tintColor, focused}) => (
    <MaterialsIcon color={tintColor} size={iconSize} name={name} />
  );
}


/**
 * Screens
 */

class MainMapScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Maps',
    tabBarIcon: makeIcon('tv')
  };

  render() {
    return (
      <MainMapView navigation={this.props.navigation} />
    );
  }
}

class DirectionsScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Directions',
    tabBarIcon: makeIcon('music-note')
  };

  render() {
    return (
      <DirectionsView navigation={this.props.navigation} />
    );
  }
}

class LocationListScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Nearby',
    tabBarIcon: makeIcon('account-box')
  };

  render() {
    return (
      <LocationListView navigation={this.props.navigation} />
    );
  }
}


/**
 * Navigator
 */

const App = TabNavigator(
  {
    MainMap: {
      screen: MainMapScreen
    },
    Directions: {
      screen: DirectionsScreen
    },
    LocationList: {
      screen: LocationListScreen
    },
  },
  {
    tabBarOptions: {
      activeTintColor:   Platform.OS === 'ios' ? '#e91e63' : '#fff',
      inactiveTintColor: Platform.OS === 'ios' ? '#f06595' : '#ccc',
      showIcon: true,
      showLabel: true,
      tabStyle: styles.tab,
      indicatorStyle: styles.indicator,
      labelStyle: styles.label,
      iconStyle: styles.icon,
      style: styles.tabbar,
    },
  }
);

export default App;
