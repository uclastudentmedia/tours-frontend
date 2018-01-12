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
  Alert,
} from 'react-native';
import PubSub from 'pubsub-js';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Tour } from 'app/DataTypes';
import {
  GetLocationById,
  RouteTBT,
} from 'app/DataManager';
import {
  DecodePolyline,
} from 'app/Utils';

import { GetIcon, logo } from 'app/Assets';
import { ToursDetailStyle as styles } from 'app/css';

export default class ToursDetailView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          tour: PropTypes.instanceOf(Tour).isRequired,
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.tour.name}`,
  });

  constructor(props) {
    super(props);
    this.tour = props.navigation.state.params.tour;
    this.locations = this.tour.landmark_ids.map(GetLocationById);
    
    this.state = {
      tourStarted: false,
    };
  }

  gotoDetail = (location) => {
    this.props.navigation.navigate('Details', {
      location: location
    });
  }

  startTour = () => {
    this.setState({ tourStarted: true });

    if (this.locations.length == 0) {
      return;
    }

    RouteTBT(this.locations)
      .then(data => {
        if (!data) {
          return;
        }
        if (data.status != 'OK') {
          Alert.alert('Unable to find a route.');
          return;
        }

        const polyline = data.routes[0].overview_polyline.points;
        let coords = DecodePolyline(polyline).map(coord => ({
            latitude: coord[0],
            longitude: coord[1],
        }));

        PubSub.publish('showRouteOnMap', {
          polyline: coords,
          locations: this.locations,
          calloutMarker: this.locations[0],
        });
      })
      .catch(error => {
        Alert.alert(error.message);
      });
    this.props.navigation.navigate('MainMap');
  }

  stopTour = () => {
    this.setState({ tourStarted: false });
    PubSub.publish('stopTour');
  }

  render() {
    const {
      name,
      image,
      duration,
      distance,
      text_description,
    } = this.tour;

    const {
      tourStarted
    } = this.state;

    return (
      <ScrollView contentContainerStyle={{flex:0}}>
        <View style={styles.container}>
          <Image source={{uri: image}} style={styles.image}/>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.length}>{duration} minutes ({distance} mi)</Text>

            {tourStarted ?
              <TouchableHighlight
                onPress={this.stopTour}
                style={[styles.button, styles.stopTour]}
                underlayColor='#e93838'
              >
                <Text style={styles.buttonText}>Stop Tour</Text>
              </TouchableHighlight>
            :
              <TouchableHighlight
                onPress={this.startTour}
                style={[styles.button, styles.startTour]}
                underlayColor='#1d57a9'
              >
                <Text style={styles.buttonText}>Start Tour</Text>
              </TouchableHighlight>
            }

            <Text style={styles.description}>{text_description}</Text>
          </View>

          <Text style={styles.header}>Locations</Text>
          {this.locations.map(loc => (
            <TouchableHighlight key={loc.id}
              onPress={() => this.gotoDetail(loc)}
              style={styles.locationBtn}
              underlayColor='#ddd'
            >
              <View style={styles.flexRow}>
                <Image style={styles.categoryIcon} source={GetIcon(loc.category_id)} />
                <Text style={styles.locationText}>{loc.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    );
  }
}
