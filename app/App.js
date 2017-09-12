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
      <MainMapView navigation={this.props.navigation} />
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
      <DirectionsView navigation={this.props.navigation} />
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
      <LocationListView navigation={this.props.navigation} />
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
      activeTintColor:   Platform.OS === 'ios' ? '#e91e63' : '#fff',
      inactiveTintColor: Platform.OS === 'ios' ? '#f06595' : '#ccc',
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

  onLoadComplete = () => {
    this.setState({loaded: true});
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingView onLoadComplete={this.onLoadComplete} />;
    }
    else {
      return <MainNavigator/>;
    }
  }
}

export default App;
