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

const MainNavigator = TabNavigator(
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
      tabStyle: styles.tab,
      indicatorStyle: styles.indicator,
      labelStyle: styles.label,
      iconStyle: styles.icon,
      style: styles.tabbar,
    },
  },
);

/**
 * Stack Navigator
 */
const detailsNavigator = StackNavigator({

    // For each screen that you can navigate to, create a new entry like this:
    LocationList: {
        // `LocationListView` is a React component that will be the main content of the screen.
        screen: LocationListView,
        // When `LocationListView` is loaded by the StackNavigator, it will be given a `navigation` prop.
    },
    Details: {
        // `DetailsView` is a React component that will be the main content of the screen.
        screen: DetailsView,
        // When `DetailsView` is loaded by the StackNavigator, it will be given a `navigation` prop.
    },
});



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
