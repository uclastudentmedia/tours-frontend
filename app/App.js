'use strict';

import React, { Component} from 'react';
import {
  Platform,
  Image,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TabNavigator, StackNavigator } from 'react-navigation';
import codePush from "react-native-code-push";

import {
  LoadingView,
  MainMapView,
  LocationListView,
  DirectionsView,
  DetailsView,
  SearchView,
  IndoorNavigationView,
  ImageView,
  ToursView,
  ToursDetailView,
} from 'app/Views';

import GPSManager from 'app/GPSManager';
import { AppStyle } from 'app/css';
import { GetTabIcon } from 'app/Assets';


function makeMaterialIcon(name) {
  /**
   * Helper function to generate Material tab icons
   * @param name string the name of the icon
   */
  const iconSize = 24;

  return ({tintColor, focused}) => (
    <MaterialIcon color={tintColor} size={iconSize} name={name} />
  );
}

function makeImageIcon(name) {
  /**
   * Helper function to generate image asset tab icons
   * @param name string the name of the icon
   */
  return ({tintColor, focused}) => (
    <Image source={GetTabIcon(name, focused)} />
  );
}

/**
 * Screens
 */

class MainMapScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Maps',
    tabBarIcon: makeImageIcon('maps')
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
    tabBarIcon: makeMaterialIcon('navigation')
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
    tabBarIcon: makeImageIcon('explore')
  };

  render() {
    return (
      <LocationListView {...this.props} />
    );
  }
}

class IndoorNavigationScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Indoor',
    tabBarIcon: makeImageIcon('indoors')
  };

  render() {
    return (
      <IndoorNavigationView {...this.props} />
    );
  }
}

const ToursScreen = StackNavigator(
  {
    ToursHome: { screen: ToursView, navigationOptions: {header: null}},
    ToursDetail: { screen: ToursDetailView },
  },
  {
    navigationOptions: {
      tabBarLabel: 'Tours',
      tabBarIcon: makeImageIcon('tours'),
    }
  }
);


/**
 * Tab Navigator
 */

const MainScreenNavigator = TabNavigator(
  {
    MainMap: { screen: MainMapScreen },
    //Directions: { screen: DirectionsScreen },
    LocationList: { screen: LocationListScreen },
    //Tours: { screen: ToursScreen },
    IndoorNavigation: { screen: IndoorNavigationScreen },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#246dd5',
      inactiveTintColor: '#cccccc',
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
    Search: { screen: SearchView },
    Image: { screen: ImageView },
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

App = codePush(App);

export default App;
