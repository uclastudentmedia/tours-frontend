'use strict';

import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator, StackNavigator } from 'react-navigation';

import {
  LoadingView,
  MainMapView,
  LocationListView,
  DirectionsView,
  DetailsView
} from 'app/Views';

import GPSManager from 'app/GPSManager';
import { AppStyle } from 'app/css';


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
    tabBarIcon: makeIcon('map')
  };

  render() {
    return (
      <MainMapView {...this.props} />
    );
  }
}

class DirectionsScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Directions',
    tabBarIcon: makeIcon('navigation')
  };

  render() {
    return (
      <DirectionsView {...this.props} />
    );
  }
}

class LocationListScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Explore',
    tabBarIcon: makeIcon('near-me')
  };

  render() {
    return (
      <LocationListView {...this.props} />
    );
  }
}


/**
 * Tab Navigator
 */

const MainScreenNavigator = TabNavigator(
  {
    MainMap: { screen: MainMapScreen },
    Directions: { screen: DirectionsScreen },
    LocationList: { screen: LocationListScreen },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: '#b3b3b3',
      showIcon: true,
      showLabel: true,
      tabStyle: AppStyle.tab,
      indicatorStyle: AppStyle.indicator,
      labelStyle: AppStyle.label,
      iconStyle: AppStyle.icon,
      style: AppStyle.tabbar,
    },
  },
);

MainScreenNavigator.navigationOptions = {
  header: null,
};


/**
 * Stack Navigator
 */
const MainNavigator = StackNavigator(
  {
    Home: { screen: MainScreenNavigator },
    Details: { screen: DetailsView },
  },
  {

  }
);



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    this.GPSManager = new GPSManager();
  }

  componentWillUnmount() {
    this.GPSManager.clearWatch();
  }

  onLoadComplete = () => {
    this.setState({loaded: true});
  }

  render() {
    const screenProps = {
      GPSManager: this.GPSManager,
    };

    if (!this.state.loaded) {
      return <LoadingView onLoadComplete={this.onLoadComplete} />;
    }
    else {
      return <MainNavigator screenProps={screenProps}/>;
    }
  }
}

export default App;
