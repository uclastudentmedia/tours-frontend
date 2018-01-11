'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Button,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import PubSub from 'pubsub-js';

import { Location } from 'app/DataTypes';
import GPSManager from 'app/GPSManager';
import { DistanceAwayText } from 'app/Utils';
import { GetIcon, logo } from 'app/Assets';
import { DetailStyle as styles } from 'app/css';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class DetailsView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          location: PropTypes.instanceOf(Location).isRequired,
          goBackFrom: PropTypes.string,
        })
      })
    }),
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.location.name}`,
  });

  constructor(props) {
    super(props);
    this.GPSManager = props.screenProps.GPSManager;
    this.state = {
      results: '',
    }
    this.location = props.navigation.state.params.location;
    this.goBackFrom = props.navigation.state.params.goBackFrom;

    const {width} = Dimensions.get('window');
    if(width >= 700) {
      this.imageSize = 'original';
    }
    else {
      this.imageSize = 'display';
    }

    if (this.location.images.length > 0) {
      this.displayImage = { uri: this.location.images[0][this.imageSize] };
    }
  }

  componentDidMount() {
    this.GPSManager.getPosition(position => {
      this.setState({ position: position });
    }, () => {});
  }

  distText = (position) => {
    const feet = this.location.FeetAway(position);
    const minutes = Math.ceil(feet/264);
    const distance = DistanceAwayText(feet);

    if (minutes < 100) {
      return `${minutes} minutes (${distance})`;
    }
    else {
      return `${distance}`;
    }
  }

  showLocationOnMap = () => {
    PubSub.publish('showLocationOnMap', this.location);

    this.props.navigation.goBack(this.goBackFrom || null);

    // https://github.com/react-community/react-navigation/issues/1127
    setTimeout(() => {
      this.props.navigation.navigate('MainMap');
    }, 0);
  }

  showRouteToLocation = () => {
    PubSub.publish('showRouteToLocation', this.location);

    this.props.navigation.goBack(this.goBackFrom || null);

    // https://github.com/react-community/react-navigation/issues/1127
    setTimeout(() => {
      this.props.navigation.navigate('MainMap');
    }, 0);
  }

  showIndoorNavigation = () => {
    this.props.navigation.goBack(this.goBackFrom || null);

    setTimeout(() => {
      this.props.navigation.navigate('IndoorNavigation', {
        location: this.location
      });
    }, 0);
  }

  showImages = () => {
    this.props.navigation.navigate('Image', {
      images: this.location.images.map((image, index) => ({
        url: image[this.imageSize],
        title: `${index+1}/${this.location.images.length}`,
      })),
      title: this.location.name,
    });
  }

  /**
   * Formats a landmark's attributes json to DOM.
   * Styles (${depth} is how deeply nested it is):
   *   - Keys with object values: styles.attrHeader${depth}
   *   - Keys with string values: styles.attrLabel${depth}
   *   - Strings: styles.attrText${depth}
   */
  renderAttributes = () => {

    const render = (json, key, depth) => {
      if (!json) {
        return null;
      }
      if (typeof json !== 'object') {
        return (
            <Text>
              <Text style={[styles.attrLabel, styles[`attrLabel${depth}`]]}>
                {key}:&nbsp;
              </Text>
              <Text style={[styles.attrText, styles[`attrText${depth}`]]}>
                {json.toString()}
              </Text>
            </Text>
        );
      }
      return (
          <View>
            <Text style={[styles.attrHeader, styles[`attrHeader${depth}`]]}>
              {key}
            </Text>
            {Object.keys(json).map(key => (
                <View key={`${depth}_${key}`} style={styles.attrIndent}>
                   {render(json[key], key, depth+1)}
                </View>
            ))}
          </View>
      );
    };

    return (
        <View style={styles.attrContainer}>
            {render(this.location.attributes, 'More Info', 0)}
        </View>
    );
  }

  render() {
    const { position } = this.state;

    return (
      <ScrollView contentContainerStyle={{flex:0}}>
        <View style={styles.container}>

          <View style={styles.titleSec}>
            <Image style={styles.icon}
              source={GetIcon(this.location.category_id)}/>
            <Text style={styles.title}>
                {this.location.name}
            </Text>
          </View>

          <TouchableHighlight onPress={this.showImages}>
            <Image source={this.displayImage} style={styles.displayImage}/>
          </TouchableHighlight>

          {position &&
            <View style={styles.distContainer}>
                <MaterialIcon size={20} name='directions-walk'/>
                <Text>{this.distText(position)}</Text>
            </View>
          }

          <View style={styles.flexRow}>
            <TouchableHighlight
              onPress={this.showLocationOnMap}
              style={[styles.button, styles.mapBtn]}
              underlayColor='#1d57a9'
            >
              <Text style={styles.buttonText}>Show on map</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.showRouteToLocation}
              style={[styles.button, styles.mapBtn]}
              underlayColor='#1d57a9'
            >
              <Text style={styles.buttonText}>Directions</Text>
            </TouchableHighlight>
          </View>
          {this.location.indoor_nav ?
            <TouchableHighlight
              onPress={this.showIndoorNavigation}
              style={[styles.button, styles.mapBtn]}
              underlayColor='#1d57a9'
            >
              <Text style={styles.buttonText}>Indoor Navigation</Text>
            </TouchableHighlight>
          : null}

          <Text style={styles.description}>
              {this.location.text_description || 'No description available.'}
          </Text>

          {this.renderAttributes()}
        </View>
      </ScrollView>
    );
  }
}
